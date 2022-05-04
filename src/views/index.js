import { useState, useEffect, useRef } from "react";
import { DateInput, SelectInput, Button, ToDoList, BulkAction } from '../components';
import {
    convertDate,
    currentDate,
    fetchLocalStorageByKey,
    saveLocalStorage,
    makeIndex
} from '../utils';
import UpdateTask from "./UpdateTask";

const now = currentDate();
const todoList = fetchLocalStorageByKey('todo-list');

const initialFormState = {
    values: { piority: 'low', dueDate: now },
    touched: { piority: true, dueDate: true },
    isValid: true,
    errors: {}
}

const initalState = {
    isUpdate: false,
    todoList: todoList || [],
    task: {},
    ...initialFormState
}

const schema = {
    subject: {
        required: true
    },
    dueDate: {
        required: true
    }
}

const Todo = () => {
    const [state, setState] = useState(initalState);
    const subjectRef = useRef();
    const descriptionRef = useRef();
    const dueDateRef = useRef();
    const piorityRef = useRef();

    const checkValidity = (value, rules, name = null) => {
        if (!rules) return null;
        let isValid = false;

        if (rules?.required) {
          isValid = !value || value.trim() === ''
          if (isValid) return `${name} is required`;
        }
    }

    const onChangeHandler = (event) => {
        event.preventDefault();
        const nameFormState = event.target.name;
        
        setState(prevState => {
            if (!prevState.errors[nameFormState]) delete prevState.errors[nameFormState];
            const validation = checkValidity(event.target.value, schema[nameFormState], nameFormState);

            const formValidation = {
                ...prevState,
                errors: {
                  ...prevState.errors,
                  [nameFormState]: validation
                },
            }

            let value = '';
            if (nameFormState === 'dueDate') {
                value = convertDate(event.target.value);
            } else value = event.target.value.trim();

            return {
                ...prevState,
                values: {
                  ...prevState.values,
                  [nameFormState]: value
                },
                touched: {
                  ...prevState.touched,
                  [nameFormState]: true,
                },
                errors: formValidation.errors,
                isValid: Object.keys(formValidation.errors).length === 0
            }
        })
    }

    const hasError = (key) => {
        if (!state.errors || !state.errors[key]) return null
        else return key in state.errors ? true : false
    }
    
    const validationError = (key) => {
        if (!state.errors || !state.errors[key]) return null
        else return key in state.errors ? state.errors[key] : null
    }

    const formValidation = () => {
        const { values } = state;
        let isValid = true;
        let errors = {};

        for (const key in schema) {
            if (key === 'description') continue;

            if (!values[key]) {
                errors = {
                    ...errors,
                    [key]: checkValidity(values[key], schema[key], key)
                }

                if (!errors[key]) delete errors[key];
                isValid = false;
                break;
            }
        }

        setState(prev => ({ ...prev, isValid, errors }));
        return isValid;
    }

    const addNewTaskHandler = () => {
        const hasError = formValidation();
        if (!hasError) return;

        setState(prevState => {
            const { values } = prevState;
            values.index = makeIndex();
            const todoList = [...prevState.todoList, values];

            saveLocalStorage('todo-list', todoList);
            subjectRef.current.value = '';
            descriptionRef.current.value = '';
            dueDateRef.current.value = now;
            piorityRef.current.value = 'low';
            
            return {
                ...prevState,
                todoList: todoList,
                ...initialFormState
            }
        });
    }

    const setTodoList = (todoList) => {
        setState(prev => ({
            ...prev,
            todoList
        }), saveLocalStorage('todo-list', todoList))
    }

    const updateTaskList = (task) => {
        let newTaskList = [];

        setState(prev => {
            const length = prev.todoList.length;
            for (let i = 0; i < length; i++) {
                const itemTask = prev.todoList[i];

                if (itemTask?.index === task?.index) {
                    newTaskList.push(task);
                } else {
                    newTaskList.push(itemTask);
                }
            }
            saveLocalStorage('todo-list', newTaskList);
            return {
                ...prev,
                todoList: newTaskList
            }
        });
    }

    const setTask = (task) => {
        setState(prev => {
            if (prev.task?.index === task.index) return { ...prev, task: {} };
            return { ...prev, task }
        });
    }

    useEffect(() => {
        if (state.errors) {
            const {errors} = state
            for (let name in errors) {
                if (!errors[name]) {
                    delete errors[name]
                    setState({
                        ...state,
                        errors: errors || null,
                        isValid: !(Object.keys(state.errors).length > 0)
                    })
                }
            }
        }
    }, [state])
    
    return (
        <div className="todo-list-project">
            <div className='wrapper-center'>
                <div className='new-task wrapper-new-task'>
                    <div className='wrapper-body'>
                        <h2 className='Text'>New Task</h2>
                        <div className="form-input">
                            <input
                                className='TextInput'
                                placeholder='Add new task ...'
                                onChange={onChangeHandler}
                                name='subject'
                                required={true}
                                ref={subjectRef}
                            />
                            {hasError('subject') && <p className='has-error'>{validationError('subject')}</p>}
                        </div>
                        <label className='Label'>Description</label>
                        <textarea
                            className='TextArea'
                            onChange={onChangeHandler}
                            name='description'
                            ref={descriptionRef}
                        />
                        <div className='row'>
                            <div className='column'>
                                <div className="form-input">
                                    <DateInput
                                        label='Due Date'
                                        onChange={onChangeHandler}
                                        value={state.values.dueDate}
                                        name='dueDate'
                                        required={true}
                                        dateRef={dueDateRef}
                                    />
                                    {hasError('dueDate') && <p className='has-error'>{validationError('dueDate')}</p>}
                                </div>
                            </div>
                            <div className='column'>
                                <div className="form-input">
                                    <SelectInput
                                        onChange={onChangeHandler}
                                        name='piority'
                                        required={true}
                                        selectRef={piorityRef}
                                    />
                                    {hasError('piority') && <p className='has-error'>{validationError('piority')}</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button
                                color='success'
                                block
                                className='space-top'
                                onClick={state.isValid ? addNewTaskHandler : null}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
                <ToDoList
                    listData={state.todoList}
                    updateItemComponent={<UpdateTask
                        task={state.task}
                        updateTaskList={updateTaskList}
                        setTask={setTask}
                    />}
                    buildActionComponent={BulkAction}
                    setTodoList={setTodoList}
                    setTask={setTask}
                    task={state.task}
                />
            </div>
        </div>
    )
}

export default Todo;
