import React from "react";
import { gql, useQuery } from "@apollo/client";

const allNotes = gql`
  query getAllNotes {
    notes {
      id
      title
      completed
    }
  }
`;

const List = () => {
  const { loading, data, error } = useQuery(allNotes);
  return (
    <ul className='list-group'>
      {data &&
        data.notes.map(note => {
          const noteStyle = {
            color: note.completed ? "green" : "red",
          };
          return (
            <li className='list-group-item' style={noteStyle} key={note.id}>
              {note.title}
            </li>
          );
        })}
    </ul>
  );
};

export default List;
