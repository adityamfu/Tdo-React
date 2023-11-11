import { useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db, auth, storage } from './config/firebase';
import { useEffect } from 'react';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [todoList, setTodoList] = useState([]);

  const [newTodoTitle, setTodoTitle] = useState('');
  const [newDescription, setDescription] = useState('');
  const [newStartDate, setStartDate] = useState('');
  const [newEndDate, setEndDate] = useState('');
  const [isNewPriority, setIsPriority] = useState(false);
  const todoListCollection = collection(db, 'todo');
  ('');

  const [updatedTitle, setUpdatedTitle] = useState('');
  const [fileUpload, setFileUpload] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getTodoList = async () => {
    try {
      const data = await getDocs(todoListCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setTodoList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getTodoList();
  }, [todoListCollection]);

  const handleSubmit = async () => {
    try {
      await addDoc(todoListCollection, {
        title: newTodoTitle,
        description: newDescription,
        startDate: newStartDate,
        endDate: newEndDate,
        priority: isNewPriority,
        userId: auth?.currentUser?.uid,
      });
    } catch (err) {
      console.error(err);
    }

    getTodoList();
    setTodoTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setIsPriority(false);
    console.log('Submit button clicked');
  };

  const deleteTodo = async (id) => {
    const todoDoc = doc(db, 'todo', id);
    await deleteDoc(todoDoc);
  };

  const updateTodoTitle = async (id) => {
    const todoDoc = doc(db, 'todo', id);
    await updateDoc(todoDoc, { title: updatedTitle });
  };

  const uploadFile = async () => {
    if (!fileUpload) {
      console.warn('No file selected for upload.');
      return;
    }

    const fileFolder = ref(storage, `docFiles/${fileUpload.name}`);
    try {
      await uploadBytes(fileFolder, fileUpload);
      console.log('File uploaded successfully!');
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  return (
    <>
      <div className="App">
        <Auth />

        <div>
          <input type="text" placeholder="Title" onChange={(e) => setTodoTitle(e.target.value)} />
          <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
          <input type="datetime-local" placeholder="Start Date" onChange={(e) => setStartDate(e.target.value)} />
          <input type="datetime-local" placeholder="End Date" onChange={(e) => setEndDate(e.target.value)} />
          <input type="checkbox" checked={isNewPriority} onChange={(e) => setIsPriority(e.target.checked)} />
          <label htmlFor="checkbox">High Priority</label>
          <button onClick={handleSubmit}>Submit</button>
        </div>

        <div>
          {todoList.map((todo) => (
            <div key={todo.id}>
              <h1>{todo.title}</h1>
              <p>{todo.description}</p>
              <p>Start Date: {formatDate(todo.startDate)}</p>
              <p>End Date: {formatDate(todo.endDate)}</p>
              <p>Priority: {todo.priority ? 'High' : 'Normal'}</p>

              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              <input type="text" placeholder="New Title..." onChange={(e) => setUpdatedTitle(e.target.value)} />
              <button onClick={() => updateTodoTitle(todo.id)}>Update</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </>
  );
}

export default App;
