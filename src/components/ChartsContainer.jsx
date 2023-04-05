import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import BarChartComponent from './BarChart';
import AreaChartComponent from './AreaChart';

const Wrapper = styled.section`
  margin-top: 4rem;
  text-align: center;
  button {
    background: transparent;
    border-color: transparent;
    text-transform: capitalize;
    color: var(--primary-500);
    font-size: 1.25rem;
    cursor: pointer;
  }
  h4 {
    text-align: center;
    margin-bottom: 0.75rem;
  }
`;

const ChartsContainer = () => {
  const [barChart, setBarChart] = useState(true);
  const { monthlyApplications } = useSelector((store) => store.allJobs);
  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type='button' onClick={() => setBarChart(!barChart)}>
        {barChart ? 'area chart' : 'bar chart'}
      </button>
      {barChart ? (
        <BarChartComponent monthlyApplications={monthlyApplications} />
      ) : (
        <AreaChartComponent monthlyApplications={monthlyApplications} />
      )}
    </Wrapper>
  );
};

export default ChartsContainer;
