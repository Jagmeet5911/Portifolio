// Background removal for the portrait, using macOS Vision (runs locally).
// usage: swiftc -O scripts/cutout.swift -o /tmp/cutout && /tmp/cutout <in> <out.png> [erodePx=0] [featherPx=0]
// Defaults keep Vision's soft mask untouched; scripts/refine-matte.mjs then removes the halo
// by decontaminating edge colors, which keeps thin profile details (lips, nose) intact.
import Foundation
import CoreImage
import CoreImage.CIFilterBuiltins
import Vision
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])
let erode = Float(args.count > 3 ? args[3] : "0") ?? 0
let feather = Float(args.count > 4 ? args[4] : "0") ?? 0

let ctx = CIContext(options: [.workingColorSpace: CGColorSpace(name: CGColorSpace.sRGB)!])
guard let src = CIImage(contentsOf: inURL, options: [.applyOrientationProperty: true]),
      let cg = ctx.createCGImage(src, from: src.extent) else { fatalError("load") }

let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: cg, options: [:])
try handler.perform([req])
guard let obs = req.results?.first else { fatalError("no foreground") }

// Keep the largest instance (the person).
var best = obs.allInstances
if obs.allInstances.count > 1 {
    var bestArea: Float = 0
    for i in obs.allInstances {
        let m = CIImage(cvPixelBuffer: try obs.generateScaledMaskForImage(forInstances: IndexSet(integer: i), from: handler))
        let avg = CIFilter.areaAverage(); avg.inputImage = m; avg.extent = m.extent
        var px = [Float](repeating: 0, count: 4)
        ctx.render(avg.outputImage!, toBitmap: &px, rowBytes: 16, bounds: CGRect(x: 0, y: 0, width: 1, height: 1), format: .RGBAf, colorSpace: nil)
        if px[0] > bestArea { bestArea = px[0]; best = IndexSet(integer: i) }
    }
}

// Optional erode/feather (off by default).
var mask = CIImage(cvPixelBuffer: try obs.generateScaledMaskForImage(forInstances: best, from: handler))
if erode > 0 {
    let ero = CIFilter.morphologyMinimum(); ero.inputImage = mask; ero.radius = erode
    mask = ero.outputImage!.cropped(to: mask.extent)
}
if feather > 0 {
    let gb = CIFilter.gaussianBlur(); gb.inputImage = mask.clampedToExtent(); gb.radius = feather
    mask = gb.outputImage!.cropped(to: mask.extent)
}

let full = CIImage(cgImage: cg)
let blend = CIFilter.blendWithMask(); blend.inputImage = full; blend.backgroundImage = CIImage.empty(); blend.maskImage = mask
var out = blend.outputImage!.cropped(to: full.extent)

// Crop to the mask's bounding box.
let w = CGFloat(cg.width), h = CGFloat(cg.height), small = 256
let sx = CGFloat(small) / w, sy = CGFloat(small) / h
var buf = [UInt8](repeating: 0, count: small * small * 4)
ctx.render(mask.transformed(by: CGAffineTransform(scaleX: sx, y: sy)), toBitmap: &buf, rowBytes: small * 4,
           bounds: CGRect(x: 0, y: 0, width: small, height: small), format: .RGBA8, colorSpace: nil)
var minX = small, minY = small, maxX = 0, maxY = 0
for y in 0..<small { for x in 0..<small where buf[(y * small + x) * 4] > 20 {
    minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y)
} }
let rect = CGRect(x: CGFloat(minX) / sx - 8, y: h - CGFloat(maxY + 1) / sy - 8,
                  width: CGFloat(maxX - minX + 1) / sx + 16, height: CGFloat(maxY - minY + 1) / sy + 16).intersection(full.extent)
out = out.cropped(to: rect)

guard let outCG = ctx.createCGImage(out, from: out.extent, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!) else { fatalError("out") }
let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, outCG, nil)
CGImageDestinationFinalize(dest)
print("ok", outCG.width, outCG.height)
