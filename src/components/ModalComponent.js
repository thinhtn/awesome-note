import React from 'react';
export default function ModalComponent(props) {
  const { display, setDisplay, children, title } = props;
  function closeModal() {
    setDisplay('none');
  }
  return (
    <div>
      <div className='modal' style={{ display: display }}>
        <div className='modal-content'>
          {/* Title */}
          <div
            className='title-new-order flex flex-row'
          >
            <p style={{ margin: 'auto', marginLeft: '24px' }}>{title}</p>
            <span className='close' onClick={closeModal}>
              &times;
            </span>
          </div>
          {/* End Title */}

          {/* Children Components */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
