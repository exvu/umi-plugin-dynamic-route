import React from 'react';
import Test from '@/components/Test';
export default props => {
  console.log(props)
  return (
    <div>
      <Test title={props?.location.pathname} {...props} />
    </div>
  );
};
