import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
import { ToServer } from '../server/Server';
import { message } from 'antd';

export const DemoLine = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    ToServer("/api/getconsumesumlogforline", "GET").then(resp => {
      if (resp.code !== 0) message.info(resp.msg)
      else {
        setData(resp.data)
      }})

  };
  const config = {
    data,
    padding: 'auto',
    xField: 'Date',
    yField: 'scales',
    xAxis: {

    },
  };

  return <Line {...config} />;
};

ReactDOM.render(<DemoLine />, document.getElementById('container'));