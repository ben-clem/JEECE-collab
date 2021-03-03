import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  services: Array<Service>;
  service?: Maybe<Service>;
  postes: Array<Poste>;
  poste?: Maybe<Poste>;
  me?: Maybe<User>;
};


export type QueryServiceArgs = {
  name: Scalars['String'];
};


export type QueryPosteArgs = {
  name: Scalars['String'];
};

export type Service = {
  __typename?: 'Service';
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};


export type Poste = {
  __typename?: 'Poste';
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  accepted: Scalars['Boolean'];
  admin: Scalars['Boolean'];
  profilePicPath?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  service?: Maybe<Scalars['String']>;
  poste?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createService: Service;
  updateService: Service;
  deleteService: Scalars['Boolean'];
  createPoste: Poste;
  updatePoste: Poste;
  deletePoste: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
};


export type MutationCreateServiceArgs = {
  name: Scalars['String'];
};


export type MutationUpdateServiceArgs = {
  newName: Scalars['String'];
  oldName: Scalars['String'];
};


export type MutationDeleteServiceArgs = {
  name: Scalars['String'];
};


export type MutationCreatePosteArgs = {
  name: Scalars['String'];
};


export type MutationUpdatePosteArgs = {
  newName: Scalars['String'];
  oldName: Scalars['String'];
};


export type MutationDeletePosteArgs = {
  name: Scalars['String'];
};


export type MutationRegisterArgs = {
  lastname: Scalars['String'];
  firstname: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
  token?: Maybe<Scalars['String']>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'token'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'email' | 'firstname' | 'lastname' | 'accepted' | 'admin' | 'profilePicPath' | 'createdAt' | 'updatedAt' | 'service' | 'poste'>
    )> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'token'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'email' | 'firstname' | 'lastname' | 'accepted' | 'admin' | 'profilePicPath' | 'createdAt' | 'updatedAt' | 'service' | 'poste'>
    )> }
  ) }
);


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    errors {
      field
      message
    }
    user {
      email
      firstname
      lastname
      accepted
      admin
      profilePicPath
      createdAt
      updatedAt
      service
      poste
    }
    token
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $firstname: String!, $lastname: String!) {
  register(
    email: $email
    password: $password
    firstname: $firstname
    lastname: $lastname
  ) {
    errors {
      field
      message
    }
    user {
      email
      firstname
      lastname
      accepted
      admin
      profilePicPath
      createdAt
      updatedAt
      service
      poste
    }
    token
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};