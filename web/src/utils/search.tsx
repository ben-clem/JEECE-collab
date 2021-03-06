import { User, useUsersByFirstnameOrLastnameQuery } from "../graphql/generated";

export const search = (input: string) => {
  const words = input.split(" ");
  let wordCurrent = words[0];


  // don't work because we can't call a hook (declare it) inside an event handler (here: onSubmit) => easy fix: move it to index
  const [
    { data, fetching, error },
    reexecuteQuery,
  ] = useUsersByFirstnameOrLastnameQuery({
    variables: {
      name: wordCurrent,
    },
    pause: false, // this query can be done server-side
  });

  let users: any;

  if (fetching) {
    // waiting
  } else if (data) {
    users.push(data.usersByFirstnameOrLastname);
  }

  words.forEach((word, i) => {
    if (i === 0) {
    } else {
      wordCurrent = word;
    }
  });

  console.log(users);

  return words;
};
