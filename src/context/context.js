import React, { useState, useEffect, useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

// Provider && consumer

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  const [request, setRequest] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({ show: false, msg: '' });

  const searchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);
    const response = await axios
      .get(`${rootUrl}/users/${user}`)
      .catch((error) => console.log(error));
    console.log(response);
    if (response) {
      setGithubUser(response.data);

      const { login, followers_url } = response.data;

      await Promise.allSettled([
        axios.get(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios.get(`${followers_url}?per_page=100`),
      ])
        .then((result) => {
          const [repos, followers] = result;
          const status = 'fulfilled';
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((error) => console.log(error));
    } else {
      toggleError(true, 'there is no user with that username!');
    }
    setIsLoading(false);
  };

  const checkRequests = () => {
    axios
      .get(`${rootUrl}/rate_limit`)
      .then((res) => {
        let {
          rate: { remaining },
        } = res.data;
        setRequest(remaining);

        if (remaining === 0) {
          // Throw an error
          toggleError(true, 'sorry, you have exceeded your hourly rate limit!');
        }
      })
      .catch((error) => console.log(error));
  };

  function toggleError(show = false, msg = '') {
    setError({ show, msg });
  }

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        request,
        error,
        isLoading,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

const useGithubContext = () => {
  return useContext(GithubContext);
};

export { useGithubContext, GithubProvider };
