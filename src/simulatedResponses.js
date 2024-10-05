// simulatedApiResponse.js

import simulatedResponseData from './simulatedResponses.json';

export const getSimulatedResponse = (query) => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return the full simulatedResponse data
      resolve({
        ...simulatedResponseData,
        query: query // Add the original query to the response
      });
    }, 1000); // Simulates a 1-second delay
  });
};

export const useSimulatedApi = false; // Set this to false to use the real API