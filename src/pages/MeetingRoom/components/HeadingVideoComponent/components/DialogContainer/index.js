import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function DialogContainer(props) {
  return (
    <DialogDiv style={{...props.diaLogStyled}}>
      {/* <span></span> */}
      <div>
        {props.children}
      </div>
    </DialogDiv>
  );
}

const DialogDiv = styled.div`
  position: absolute;
  background: #037FF3;
  
  left: 50%; 
  transform: translateX(-50%) translateY(20px);
  border-radius: 5px;
  display: flex;
  padding: 10px;

  span{
    transform: translateY(-150%);
    width: 10px;
    height: 10px;
    position: absolute;
    
    display: block;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 15px solid #037FF3;
  }
`;
export default DialogContainer;
