import React from 'react';
import Test from '@/components/Test';
export default props => {
  return (
    <div>
      <Test title="test1" {...props} />
    </div>
  );
};
