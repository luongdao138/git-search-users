import React from 'react';
import styled from 'styled-components';
import { useGithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {
  const { repos } = useGithubContext();
  let languages = repos.reduce((total, item) => {
    const { language, stargazers_count, watchers_count } = item;
    if (!language) {
      return total;
    }
    if (!total[language]) {
      total[language] = {
        label: language,
        value: 1,
        stars: stargazers_count,
      };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: stargazers_count + total[language].stars,
      };
    }
    return total;
  }, {});

  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return -a.value + b.value;
    })
    .slice(0, 5);

  const mostPopular = Object.values(languages)
    .map((item) => {
      return {
        label: item.label,
        value: item.stars,
      };
    })
    .sort((a, b) => {
      return -a.value + b.value;
    })
    .slice(0, 5);

  const mostWatchers = repos
    .slice()
    .sort((a, b) => -a.watchers + b.watchers)
    .slice(0, 5)
    .map((item) => {
      return { label: item.name, value: item.watchers };
    });
  const mostForked = repos
    .slice()
    .sort((a, b) => -a.forks_count + b.forks_count)
    .slice(0, 5)
    .map((item) => {
      return { label: item.name, value: item.forks_count };
    });
  // console.log(mostForked);

  return (
    <section className='section'>
      <Wrapper className='section-center'>
        {/* <ExampleChart data={chartData} />; */}
        <Pie3D data={mostUsed} />
        <Column3D data={mostWatchers} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={mostForked} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
