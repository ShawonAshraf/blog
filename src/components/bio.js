import React from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';

import media from '../utils/media';
import Twitter from '../images/social/twitter.svg';
import Web from '../images/social/web.png';
import LinkedIn from '../images/social/linkedin.png';
import GitHub from '../images/social/gh.png';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5rem 0;

  ${media.tablet`
    flex-direction: column;
    text-align: center;
  `}
`;

const TextContainer = styled.div`
  ${media.phone`
    order: 2;
  `}
`;

const Name = styled.h3`
  font-size: 2.4rem;
  letter-spacing: 0.1rem;
  font-weight: 800;
  margin-bottom: 1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-family: 'system', 'Helvetica';
`;

const TagLine = styled.sub`
  font-weight: normal;
  font-size: 1.6rem;
  margin: 0;
  display: block;
`;

const TwitterIcon = styled.img`
  height: 1.5rem;
  width: 1.5rem;
  padding: 1.5rem 1rem;
`;

const Bio = () => (
  <StaticQuery
    query={bioQuery}
    render={(data) => {
      const { author, authorTagline, social } = data.site.siteMetadata;
      return (
        <Container>
          <TextContainer>
            <Name>{author}</Name>
            <TagLine>{authorTagline}</TagLine>
            <a
              href={`https://twitter.com/${social.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon src={Twitter} alt="twitter" />
            </a>

            <a
              href={`https://shawonashraf.com/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon src={Web} alt="website" />
            </a>

            <a
              href={`https://www.linkedin.com/in/shawon-ashraf-96162763/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon src={LinkedIn} alt="linked_in" />
            </a>

            <a
              href={`https://github.com/ShawonAshraf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon src={GitHub} alt="github" />
            </a>
          </TextContainer>
        </Container>
      );
    }}
  />
);

const bioQuery = graphql`
  query BioQuery {
    site {
      siteMetadata {
        author
        authorTagline
        social {
          twitter
        }
      }
    }
  }
`;

export default Bio;
