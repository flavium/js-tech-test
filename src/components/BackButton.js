import React from 'react';
import {
  Button,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function BackButton(props) {
  return (
    <Button className='BackButton' onClick={() => props.onClick()}>
      <FontAwesomeIcon icon='chevron-left' />
    </Button>);
}

export default BackButton;
