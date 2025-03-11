import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <button onClick={onClose} className="float-right text-gray-400 hover:text-white">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;