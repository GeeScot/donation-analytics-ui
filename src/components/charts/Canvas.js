import styled from 'styled-components';

export const Canvas = styled.canvas`
  margin: 0 auto;
  width: 700px;
`;

export const ChartContainer = styled.div`
  display: inline-block;
  width: 700px;
  padding: 20px 40px;
  
  justify-self: center;
  align-self: center;

  border: 1px solid #cccccc;
  border-radius: 6px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

  @media print {
    border: none;
    box-shadow: none;
  }
`;
