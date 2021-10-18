import React from 'react';

const Loader = ({ count = 4 }) => {
  return (
    <div className="bg-gray-200 overflow-hidden divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px shadow rounded">
      {new Array(count).fill('').map((_, productIx) => (
        <div key={productIx} className={`relative group bg-white p-6`}>
          <div className="animate-pulse">
            <div className="flex justify-between">
              <div className="bg-gray-400 rounded inline-flex p-3 ring-4 ring-white h-12 w-12"></div>
              <div className="flex items-center">
                <div className="w-12 h-8 rounded bg-gray-400"></div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex flex-row justify-between">
                <div className="h-4 w-1/3 bg-gray-400 rounded"></div>
              </div>
              <p className="mt-2 h-4 w-1/2 text-sm text-gray-500 bg-gray-400"></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
