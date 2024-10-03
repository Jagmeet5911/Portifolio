import React from 'react'
import { TimelineItem, TimelineDot ,TimelineSeparator, TimelineConnector, TimelineContent, Timeline } from '@mui/lab';
import styled from 'styled-components';
import { education } from '../../data/details';
import EducationCard from '../Cards/EducationCard';
const Container = styled.div `
   display : flex;
   flex-direction: column;
   justify content : center;
   position : relative;
   z-index : 1;
   align-items : center;
`;

const Wrapper = styled.div `
   max-width: 1100px;
   position : relative;
   display: flex;
   flex-direction: column;
   justify-content : center;
   align-items: space-between;
   width: 100%;
   gap : 12px;
   `;
   const Title = styled.div`
   font-size: 42px;
   text-align: center;
   font-weight: 600;
   margin-top: 20px;
     color: ${({ theme }) => theme.text_primary};
     @media (max-width: 768px) {
   margin-top: 12px;
         font-size: 32px;
     }
   `;
   const Desc = styled.div`
   font-size: 20px;
   text-align: center;
   
   color: ${({ theme }) => theme.text_secondary};
   @media (max-width: 768px) {
       font-size: 16px;
   }
`;
const TimeLineSection = styled.div `
  width: 100%;
  max-width: 1000px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;
 
const Education = () => {
  return (
    <Container id = "education">
        <Wrapper>
            <Title>Education</Title>
            <Desc> My education has been a journey of self-discovery and growth. My educational details are as follows. </Desc>
            <TimeLineSection>
                <Timeline>
                    {education.map((educations,index)=> (
                        <TimelineItem>
                          
                            <TimelineContent sx={{py:"12px",px: 2}}> 
                              <EducationCard educations={educations}/>
                               </TimelineContent>
                               <TimelineSeparator>
                                    <TimelineDot variant="outlined" color="secondary" />
                                    {index !== educations.length  && <TimelineConnector style={{ background: '#854CE6' }} />}
                                </TimelineSeparator>
                        </TimelineItem>
                    ))}
            </Timeline>
            </TimeLineSection>
                   
        </Wrapper>
    </Container>
  )
}

export default Education
