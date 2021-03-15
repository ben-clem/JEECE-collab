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
  conversations: Array<Conversation>;
  conversationByUuid: ConvResponse;
  conversationsByUserId: ConvsResponse;
  conversationWithUserIds: ConvResponse;
  hello: Scalars['String'];
  messages: Array<Message>;
  postes: Array<Poste>;
  posteByName?: Maybe<Poste>;
  posteById?: Maybe<Poste>;
  services: Array<Service>;
  serviceByName?: Maybe<Service>;
  serviceById?: Maybe<Service>;
  me?: Maybe<User>;
  userById?: Maybe<User>;
  usersByFnOrLnOrSnOrPnLikeWordsInString?: Maybe<Array<User>>;
  usersPending?: Maybe<Array<User>>;
  documentsByUserId: Array<Document>;
};


export type QueryConversationByUuidArgs = {
  uuid: Scalars['String'];
};


export type QueryConversationsByUserIdArgs = {
  id: Scalars['Int'];
};


export type QueryConversationWithUserIdsArgs = {
  id2: Scalars['Int'];
  id1: Scalars['Int'];
};


export type QueryMessagesArgs = {
  convUuid: Scalars['String'];
};


export type QueryPosteByNameArgs = {
  name: Scalars['String'];
};


export type QueryPosteByIdArgs = {
  id: Scalars['Int'];
};


export type QueryServiceByNameArgs = {
  name: Scalars['String'];
};


export type QueryServiceByIdArgs = {
  id: Scalars['Int'];
};


export type QueryUserByIdArgs = {
  id: Scalars['Int'];
};


export type QueryUsersByFnOrLnOrSnOrPnLikeWordsInStringArgs = {
  string: Scalars['String'];
};


export type QueryDocumentsByUserIdArgs = {
  id: Scalars['Int'];
};

export type Conversation = {
  __typename?: 'Conversation';
  uuid: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  convToUsers: Array<ConvToUser>;
  messages: Array<Message>;
};


export type ConvToUser = {
  __typename?: 'ConvToUser';
  convToUserId: Scalars['Int'];
  active: Scalars['Boolean'];
  conversationUuid: Scalars['String'];
  userId: Scalars['Float'];
};

export type Message = {
  __typename?: 'Message';
  uuid: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  conversationUuid: Scalars['String'];
  conversation: Conversation;
  userId: Scalars['Float'];
  user: User;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  accepted?: Maybe<Scalars['Boolean']>;
  admin: Scalars['Boolean'];
  profilePicPath?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  serviceId?: Maybe<Scalars['Int']>;
  posteId?: Maybe<Scalars['Int']>;
  service: Service;
  poste: Poste;
};

export type Service = {
  __typename?: 'Service';
  id: Scalars['Int'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Poste = {
  __typename?: 'Poste';
  id: Scalars['Int'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type ConvResponse = {
  __typename?: 'ConvResponse';
  _id: Scalars['String'];
  error?: Maybe<Scalars['String']>;
  conv?: Maybe<Conversation>;
};

export type ConvsResponse = {
  __typename?: 'ConvsResponse';
  error?: Maybe<Scalars['String']>;
  convs?: Maybe<Array<Conversation>>;
};

export type Document = {
  __typename?: 'Document';
  id: Scalars['Float'];
  filePath: Scalars['String'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createConversationWithUserIds: ConvResponse;
  updateConvToUser: Scalars['String'];
  addMessage: Message;
  createPoste: Poste;
  updatePoste: Poste;
  deletePoste: Scalars['Boolean'];
  createService: Service;
  updateService: Service;
  deleteService: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  updateUserAccepted: User;
  addDocument: Document;
};


export type MutationCreateConversationWithUserIdsArgs = {
  id2: Scalars['Int'];
  id1: Scalars['Int'];
};


export type MutationUpdateConvToUserArgs = {
  active: Scalars['Boolean'];
  userId: Scalars['Int'];
  convUuid: Scalars['String'];
};


export type MutationAddMessageArgs = {
  userId: Scalars['Int'];
  convUuid: Scalars['String'];
  message: Scalars['String'];
};


export type MutationCreatePosteArgs = {
  name: Scalars['String'];
};


export type MutationUpdatePosteArgs = {
  newName: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationDeletePosteArgs = {
  id?: Maybe<Scalars['Int']>;
};


export type MutationCreateServiceArgs = {
  name: Scalars['String'];
};


export type MutationUpdateServiceArgs = {
  newName: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationDeleteServiceArgs = {
  id?: Maybe<Scalars['Int']>;
};


export type MutationRegisterArgs = {
  posteId?: Maybe<Scalars['Int']>;
  serviceId?: Maybe<Scalars['Int']>;
  lastname: Scalars['String'];
  firstname: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationUpdateUserAcceptedArgs = {
  accepted: Scalars['Boolean'];
  id: Scalars['Int'];
};


export type MutationAddDocumentArgs = {
  postesIds?: Maybe<Array<Scalars['Int']>>;
  servicesIds?: Maybe<Array<Scalars['Int']>>;
  name: Scalars['String'];
  path: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'firstname' | 'lastname' | 'accepted' | 'admin' | 'profilePicPath' | 'createdAt' | 'updatedAt' | 'serviceId' | 'posteId'>
);

export type AddDocumentMutationVariables = Exact<{
  path: Scalars['String'];
  name: Scalars['String'];
  servicesIds?: Maybe<Array<Scalars['Int']> | Scalars['Int']>;
  postesIds?: Maybe<Array<Scalars['Int']> | Scalars['Int']>;
}>;


export type AddDocumentMutation = (
  { __typename?: 'Mutation' }
  & { addDocument: (
    { __typename?: 'Document' }
    & Pick<Document, 'id' | 'filePath' | 'name' | 'createdAt' | 'updatedAt'>
  ) }
);

export type AddMessageMutationVariables = Exact<{
  message: Scalars['String'];
  convUuid: Scalars['String'];
  userId: Scalars['Int'];
}>;


export type AddMessageMutation = (
  { __typename?: 'Mutation' }
  & { addMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'uuid' | 'content' | 'createdAt' | 'updatedAt'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'firstname' | 'lastname' | 'profilePicPath'>
      & { service: (
        { __typename?: 'Service' }
        & Pick<Service, 'name'>
      ), poste: (
        { __typename?: 'Poste' }
        & Pick<Poste, 'name'>
      ) }
    ) }
  ) }
);

export type CreateConversationWithUserIdsMutationVariables = Exact<{
  id1: Scalars['Int'];
  id2: Scalars['Int'];
}>;


export type CreateConversationWithUserIdsMutation = (
  { __typename?: 'Mutation' }
  & { createConversationWithUserIds: (
    { __typename?: 'ConvResponse' }
    & Pick<ConvResponse, 'error'>
    & { conv?: Maybe<(
      { __typename?: 'Conversation' }
      & Pick<Conversation, 'uuid' | 'createdAt' | 'updatedAt'>
      & { convToUsers: Array<(
        { __typename?: 'ConvToUser' }
        & Pick<ConvToUser, 'userId' | 'active'>
      )> }
    )> }
  ) }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & UserFragment
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  serviceId?: Maybe<Scalars['Int']>;
  posteId?: Maybe<Scalars['Int']>;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & UserFragment
    )> }
  ) }
);

export type UpdateConvToUserMutationVariables = Exact<{
  convUuid: Scalars['String'];
  userId: Scalars['Int'];
  active: Scalars['Boolean'];
}>;


export type UpdateConvToUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateConvToUser'>
);

export type UpdateUserAcceptedMutationVariables = Exact<{
  id: Scalars['Int'];
  accepted: Scalars['Boolean'];
}>;


export type UpdateUserAcceptedMutation = (
  { __typename?: 'Mutation' }
  & { updateUserAccepted: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstname' | 'lastname' | 'accepted' | 'admin' | 'profilePicPath' | 'createdAt' | 'updatedAt'>
  ) }
);

export type ConversationByUuidQueryVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type ConversationByUuidQuery = (
  { __typename?: 'Query' }
  & { conversationByUuid: (
    { __typename?: 'ConvResponse' }
    & Pick<ConvResponse, 'error'>
    & { conv?: Maybe<(
      { __typename?: 'Conversation' }
      & Pick<Conversation, 'uuid' | 'createdAt' | 'updatedAt'>
      & { convToUsers: Array<(
        { __typename?: 'ConvToUser' }
        & Pick<ConvToUser, 'userId' | 'active'>
      )> }
    )> }
  ) }
);

export type ConversationWithUserIdsQueryVariables = Exact<{
  id1: Scalars['Int'];
  id2: Scalars['Int'];
}>;


export type ConversationWithUserIdsQuery = (
  { __typename?: 'Query' }
  & { conversationWithUserIds: (
    { __typename?: 'ConvResponse' }
    & Pick<ConvResponse, '_id' | 'error'>
    & { conv?: Maybe<(
      { __typename?: 'Conversation' }
      & Pick<Conversation, 'uuid' | 'createdAt' | 'updatedAt'>
      & { convToUsers: Array<(
        { __typename?: 'ConvToUser' }
        & Pick<ConvToUser, 'convToUserId' | 'userId' | 'active'>
      )> }
    )> }
  ) }
);

export type ConversationsQueryVariables = Exact<{ [key: string]: never; }>;


export type ConversationsQuery = (
  { __typename?: 'Query' }
  & { conversations: Array<(
    { __typename?: 'Conversation' }
    & Pick<Conversation, 'uuid' | 'createdAt' | 'updatedAt'>
    & { convToUsers: Array<(
      { __typename?: 'ConvToUser' }
      & Pick<ConvToUser, 'userId' | 'active'>
    )> }
  )> }
);

export type ConversationsByUserIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ConversationsByUserIdQuery = (
  { __typename?: 'Query' }
  & { conversationsByUserId: (
    { __typename?: 'ConvsResponse' }
    & Pick<ConvsResponse, 'error'>
    & { convs?: Maybe<Array<(
      { __typename?: 'Conversation' }
      & Pick<Conversation, 'uuid' | 'createdAt' | 'updatedAt'>
      & { convToUsers: Array<(
        { __typename?: 'ConvToUser' }
        & Pick<ConvToUser, 'userId' | 'active'>
      )> }
    )>> }
  ) }
);

export type DocumentsByUserIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DocumentsByUserIdQuery = (
  { __typename?: 'Query' }
  & { documentsByUserId: Array<(
    { __typename?: 'Document' }
    & Pick<Document, 'id' | 'filePath' | 'name' | 'createdAt' | 'updatedAt'>
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type MessagesQueryVariables = Exact<{
  convUuid: Scalars['String'];
}>;


export type MessagesQuery = (
  { __typename?: 'Query' }
  & { messages: Array<(
    { __typename?: 'Message' }
    & Pick<Message, 'uuid' | 'content' | 'createdAt' | 'updatedAt'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'firstname' | 'lastname' | 'profilePicPath'>
      & { service: (
        { __typename?: 'Service' }
        & Pick<Service, 'name'>
      ), poste: (
        { __typename?: 'Poste' }
        & Pick<Poste, 'name'>
      ) }
    ) }
  )> }
);

export type PosteByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PosteByIdQuery = (
  { __typename?: 'Query' }
  & { posteById?: Maybe<(
    { __typename?: 'Poste' }
    & Pick<Poste, 'id' | 'name' | 'createdAt' | 'updatedAt'>
  )> }
);

export type PostesQueryVariables = Exact<{ [key: string]: never; }>;


export type PostesQuery = (
  { __typename?: 'Query' }
  & { postes: Array<(
    { __typename?: 'Poste' }
    & Pick<Poste, 'id' | 'name' | 'createdAt' | 'updatedAt'>
  )> }
);

export type ServiceByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ServiceByIdQuery = (
  { __typename?: 'Query' }
  & { serviceById?: Maybe<(
    { __typename?: 'Service' }
    & Pick<Service, 'id' | 'name' | 'createdAt' | 'updatedAt'>
  )> }
);

export type ServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type ServicesQuery = (
  { __typename?: 'Query' }
  & { services: Array<(
    { __typename?: 'Service' }
    & Pick<Service, 'id' | 'name' | 'createdAt' | 'updatedAt'>
  )> }
);

export type UserByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UserByIdQuery = (
  { __typename?: 'Query' }
  & { userById?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstname' | 'lastname' | 'accepted' | 'admin' | 'profilePicPath' | 'createdAt' | 'updatedAt'>
    & { service: (
      { __typename?: 'Service' }
      & Pick<Service, 'id' | 'name'>
    ), poste: (
      { __typename?: 'Poste' }
      & Pick<Poste, 'id' | 'name'>
    ) }
  )> }
);

export type UsersByFnOrLnOrSnOrPnLikeWordsInStringQueryVariables = Exact<{
  string: Scalars['String'];
}>;


export type UsersByFnOrLnOrSnOrPnLikeWordsInStringQuery = (
  { __typename?: 'Query' }
  & { usersByFnOrLnOrSnOrPnLikeWordsInString?: Maybe<Array<(
    { __typename?: 'User' }
    & UserFragment
  )>> }
);

export type UsersPendingQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersPendingQuery = (
  { __typename?: 'Query' }
  & { usersPending?: Maybe<Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstname' | 'lastname' | 'accepted' | 'admin' | 'profilePicPath' | 'createdAt' | 'updatedAt'>
    & { service: (
      { __typename?: 'Service' }
      & Pick<Service, 'id' | 'name'>
    ), poste: (
      { __typename?: 'Poste' }
      & Pick<Poste, 'id' | 'name'>
    ) }
  )>> }
);

export const UserFragmentDoc = gql`
    fragment User on User {
  id
  email
  firstname
  lastname
  accepted
  admin
  profilePicPath
  createdAt
  updatedAt
  serviceId
  posteId
}
    `;
export const AddDocumentDocument = gql`
    mutation addDocument($path: String!, $name: String!, $servicesIds: [Int!], $postesIds: [Int!]) {
  addDocument(
    path: $path
    name: $name
    servicesIds: $servicesIds
    postesIds: $postesIds
  ) {
    id
    filePath
    name
    createdAt
    updatedAt
  }
}
    `;

export function useAddDocumentMutation() {
  return Urql.useMutation<AddDocumentMutation, AddDocumentMutationVariables>(AddDocumentDocument);
};
export const AddMessageDocument = gql`
    mutation addMessage($message: String!, $convUuid: String!, $userId: Int!) {
  addMessage(message: $message, convUuid: $convUuid, userId: $userId) {
    uuid
    content
    createdAt
    updatedAt
    user {
      id
      email
      firstname
      lastname
      service {
        name
      }
      poste {
        name
      }
      profilePicPath
    }
  }
}
    `;

export function useAddMessageMutation() {
  return Urql.useMutation<AddMessageMutation, AddMessageMutationVariables>(AddMessageDocument);
};
export const CreateConversationWithUserIdsDocument = gql`
    mutation createConversationWithUserIds($id1: Int!, $id2: Int!) {
  createConversationWithUserIds(id1: $id1, id2: $id2) {
    error
    conv {
      uuid
      createdAt
      updatedAt
      convToUsers {
        userId
        active
      }
    }
  }
}
    `;

export function useCreateConversationWithUserIdsMutation() {
  return Urql.useMutation<CreateConversationWithUserIdsMutation, CreateConversationWithUserIdsMutationVariables>(CreateConversationWithUserIdsDocument);
};
export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    errors {
      field
      message
    }
    user {
      ...User
    }
  }
}
    ${UserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation register($email: String!, $password: String!, $firstname: String!, $lastname: String!, $serviceId: Int, $posteId: Int) {
  register(
    email: $email
    password: $password
    firstname: $firstname
    lastname: $lastname
    serviceId: $serviceId
    posteId: $posteId
  ) {
    errors {
      field
      message
    }
    user {
      ...User
    }
  }
}
    ${UserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateConvToUserDocument = gql`
    mutation updateConvToUser($convUuid: String!, $userId: Int!, $active: Boolean!) {
  updateConvToUser(convUuid: $convUuid, userId: $userId, active: $active)
}
    `;

export function useUpdateConvToUserMutation() {
  return Urql.useMutation<UpdateConvToUserMutation, UpdateConvToUserMutationVariables>(UpdateConvToUserDocument);
};
export const UpdateUserAcceptedDocument = gql`
    mutation updateUserAccepted($id: Int!, $accepted: Boolean!) {
  updateUserAccepted(id: $id, accepted: $accepted) {
    id
    email
    firstname
    lastname
    accepted
    admin
    profilePicPath
    createdAt
    updatedAt
  }
}
    `;

export function useUpdateUserAcceptedMutation() {
  return Urql.useMutation<UpdateUserAcceptedMutation, UpdateUserAcceptedMutationVariables>(UpdateUserAcceptedDocument);
};
export const ConversationByUuidDocument = gql`
    query conversationByUuid($uuid: String!) {
  conversationByUuid(uuid: $uuid) {
    error
    conv {
      uuid
      createdAt
      updatedAt
      convToUsers {
        userId
        active
      }
    }
  }
}
    `;

export function useConversationByUuidQuery(options: Omit<Urql.UseQueryArgs<ConversationByUuidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ConversationByUuidQuery>({ query: ConversationByUuidDocument, ...options });
};
export const ConversationWithUserIdsDocument = gql`
    query conversationWithUserIds($id1: Int!, $id2: Int!) {
  conversationWithUserIds(id1: $id1, id2: $id2) {
    _id
    error
    conv {
      uuid
      createdAt
      updatedAt
      convToUsers {
        convToUserId
        userId
        active
      }
    }
  }
}
    `;

export function useConversationWithUserIdsQuery(options: Omit<Urql.UseQueryArgs<ConversationWithUserIdsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ConversationWithUserIdsQuery>({ query: ConversationWithUserIdsDocument, ...options });
};
export const ConversationsDocument = gql`
    query conversations {
  conversations {
    uuid
    createdAt
    updatedAt
    convToUsers {
      userId
      active
    }
  }
}
    `;

export function useConversationsQuery(options: Omit<Urql.UseQueryArgs<ConversationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ConversationsQuery>({ query: ConversationsDocument, ...options });
};
export const ConversationsByUserIdDocument = gql`
    query conversationsByUserId($id: Int!) {
  conversationsByUserId(id: $id) {
    error
    convs {
      uuid
      createdAt
      updatedAt
      convToUsers {
        userId
        active
      }
    }
  }
}
    `;

export function useConversationsByUserIdQuery(options: Omit<Urql.UseQueryArgs<ConversationsByUserIdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ConversationsByUserIdQuery>({ query: ConversationsByUserIdDocument, ...options });
};
export const DocumentsByUserIdDocument = gql`
    query documentsByUserId($id: Int!) {
  documentsByUserId(id: $id) {
    id
    filePath
    name
    createdAt
    updatedAt
  }
}
    `;

export function useDocumentsByUserIdQuery(options: Omit<Urql.UseQueryArgs<DocumentsByUserIdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<DocumentsByUserIdQuery>({ query: DocumentsByUserIdDocument, ...options });
};
export const MeDocument = gql`
    query me {
  me {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const MessagesDocument = gql`
    query messages($convUuid: String!) {
  messages(convUuid: $convUuid) {
    uuid
    content
    createdAt
    updatedAt
    user {
      id
      email
      firstname
      lastname
      service {
        name
      }
      poste {
        name
      }
      profilePicPath
    }
  }
}
    `;

export function useMessagesQuery(options: Omit<Urql.UseQueryArgs<MessagesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MessagesQuery>({ query: MessagesDocument, ...options });
};
export const PosteByIdDocument = gql`
    query posteById($id: Int!) {
  posteById(id: $id) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function usePosteByIdQuery(options: Omit<Urql.UseQueryArgs<PosteByIdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PosteByIdQuery>({ query: PosteByIdDocument, ...options });
};
export const PostesDocument = gql`
    query postes {
  postes {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function usePostesQuery(options: Omit<Urql.UseQueryArgs<PostesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostesQuery>({ query: PostesDocument, ...options });
};
export const ServiceByIdDocument = gql`
    query serviceById($id: Int!) {
  serviceById(id: $id) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useServiceByIdQuery(options: Omit<Urql.UseQueryArgs<ServiceByIdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ServiceByIdQuery>({ query: ServiceByIdDocument, ...options });
};
export const ServicesDocument = gql`
    query services {
  services {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useServicesQuery(options: Omit<Urql.UseQueryArgs<ServicesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ServicesQuery>({ query: ServicesDocument, ...options });
};
export const UserByIdDocument = gql`
    query userById($id: Int!) {
  userById(id: $id) {
    id
    email
    firstname
    lastname
    accepted
    admin
    profilePicPath
    createdAt
    updatedAt
    service {
      id
      name
    }
    poste {
      id
      name
    }
  }
}
    `;

export function useUserByIdQuery(options: Omit<Urql.UseQueryArgs<UserByIdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserByIdQuery>({ query: UserByIdDocument, ...options });
};
export const UsersByFnOrLnOrSnOrPnLikeWordsInStringDocument = gql`
    query usersByFnOrLnOrSnOrPnLikeWordsInString($string: String!) {
  usersByFnOrLnOrSnOrPnLikeWordsInString(string: $string) {
    ...User
  }
}
    ${UserFragmentDoc}`;

export function useUsersByFnOrLnOrSnOrPnLikeWordsInStringQuery(options: Omit<Urql.UseQueryArgs<UsersByFnOrLnOrSnOrPnLikeWordsInStringQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UsersByFnOrLnOrSnOrPnLikeWordsInStringQuery>({ query: UsersByFnOrLnOrSnOrPnLikeWordsInStringDocument, ...options });
};
export const UsersPendingDocument = gql`
    query usersPending {
  usersPending {
    id
    email
    firstname
    lastname
    accepted
    admin
    profilePicPath
    createdAt
    updatedAt
    service {
      id
      name
    }
    poste {
      id
      name
    }
  }
}
    `;

export function useUsersPendingQuery(options: Omit<Urql.UseQueryArgs<UsersPendingQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UsersPendingQuery>({ query: UsersPendingDocument, ...options });
};