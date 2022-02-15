const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");
const { default: Axios } = require("axios");

const getNotesOrNote = async noteId => {
  const url = noteId
    ? `https://jsonplaceholder.typicode.com/todos/${noteId}`
    : "https://jsonplaceholder.typicode.com/todos";
  const response = await Axios.get(url);
  return response.data;
};

const getUsersOrUser = async userId => {
  const url = userId
    ? `https://jsonplaceholder.typicode.com/users/${userId}`
    : "https://jsonplaceholder.typicode.com/users";
  const response = await Axios.get(url);
  return response.data;
};

const noteType = new GraphQLObjectType({
  name: "Note",
  description: "single note",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    userId: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    completed: { type: GraphQLNonNull(GraphQLBoolean) },
  }),
});

const userType = new GraphQLObjectType({
  name: "User",
  description: "single user",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    username: { type: GraphQLNonNull(GraphQLString) },
    notes: {
      type: GraphQLList(noteType),
      description: "list users notes",
      resolve: parent =>
        getNotesOrNote().then(notes =>
          notes.filter(note => note.userId === parent.id)
        ),
    },
  }),
});

const rootQueryType = new GraphQLObjectType({
  name: "rootQuery",
  description: "root query",
  fields: () => ({
    notes: {
      type: GraphQLList(noteType),
      description: "list of notes",
      resolve: () => getNotesOrNote(),
    },
    note: {
      type: noteType,
      description: "single note",
      args: {
        noteId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (p, args) => getNotesOrNote(args.noteId),
    },
    users: {
      type: GraphQLList(userType),
      description: "list of users",
      resolve: () => getUsersOrUser(),
    },
    user: {
      type: userType,
      description: "single user",
      args: {
        userId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (p, args) => getUsersOrUser(args.userId),
    },
  }),
});

const todoSchema = new GraphQLSchema({ query: rootQueryType });

module.exports = { todoSchema };
