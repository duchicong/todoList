import { useState, useEffect } from 'react';
import { DateInput, SelectInput, Button } from '../components';
import {
    convertDate
} from '../utils';

const schema = {
    subject: {
        required: true
    },
    dueDate: {
        required: true
    }
}

const UpdateTask = (props) => {
    const {
        task,
        setTask,
        updateTaskList
    } = props;
    
    const initialFormState = {
        values: { ...task },
        touched: { piority: true, dueDate: true },
        isValid: true,
        errors: {}
    }
    const [state, setState] = useState(initialFormState);

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

    const checkValidity = (value, rules, name = null) => {
        if (!rules) return null;
        let isValid = false;

        if (rules?.required) {
          isValid = !value || value.trim() === ''
          if (isValid) return `${name} is required`;
        }
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

    const updateTaskHandler = () => {
        const hasError = formValidation();
        if (!hasError) return;
        updateTaskList(values);
        setTask(values);
        setState(prev => ({
            ...prev,
            values
        }));
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

    const { values } = state;
    return (
        <div className='update-task wrapper-new-task'>
            <div className='wrapper-body'>
                <div className="form-input">
                    <input
                        className='TextInput'
                        placeholder='Add new task ...'
                        onChange={onChangeHandler}
                        defaultValue={values.subject}
                        name='subject'
                        required={true}
                    />
                    {hasError('subject') && <p className='has-error'>{validationError('subject')}</p>}
                </div>
                <label className='Label'>Description</label>
                <textarea
                    className='TextArea'
                    onChange={onChangeHandler}
                    name='description'
                    defaultValue={values.description}
                />
                <div className='row'>
                    <div className='column'>
                        <div className="form-input">
                            <DateInput
                                label='Due Date'
                                onChange={onChangeHandler}
                                value={values.dueDate}
                                name='dueDate'
                                required={true}
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
                                value={values.piority}
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
                        onClick={state.isValid ? updateTaskHandler : null}
                    >
                        Update
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UpdateTask;
