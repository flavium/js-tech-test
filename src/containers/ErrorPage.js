import React from 'react';
import PropTypes from 'prop-types';

function ErrorPage({ errorList }) {
  return (
    <div className='Error500'>
      <div className='SectionContent'>
        <h1 className='Title'>Oops! We have a problem!</h1>
        <ul className='Description'>
          {errorList.map((error) => (
            <li key={error.code}>
              {error.code} - {error.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ErrorPage.propTypes = {
  errorList: PropTypes.array,
};

export default ErrorPage;
