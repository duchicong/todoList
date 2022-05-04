import { Fragment, useState } from 'react';
import { Button } from '../';
import './style.css';

const ToDoList = (props) => {
    const {
        listData,
        updateItemComponent,
        setTodoList,
        buildActionComponent,
        setTask,
        task
    } = props;
    const [state, setState] = useState({
        checkedList: []
    });
    if (!(Array.isArray(listData) || listData.length === 0)) return;
    const BuildActionComponent = buildActionComponent;
    
    const checkboxHandler = (e) => {
        setState(prev => {
            let checkedList = prev.checkedList;
            const name = e.target.name;
            const isChecked = e.target.checked;

            if (isChecked) {
                checkedList.push(name);
            } else {
                const index = checkedList.indexOf(name);
                checkedList.splice(index, 1);
            }

            return {
                ...prev,
                checkedList
            }
        })
    }

    const isShowDetailHandler = (todo) => (e) => {
        setTask(todo);
    }

    const removeTask = (todo) => () => {
        const newListData = listData.filter((item) => {
            if (item.index !== todo.index) {
                return item;
            } else {
                setState(prev => {
                    const { checkedList } = prev;
                    const index = checkedList.indexOf(item.index);
                    const newCheckedList = (index === -1) ? checkedList : checkedList.splice(index, 1);
                    return {
                        ...prev,
                        checkedList: newCheckedList
                    }
                });
                return undefined;
            }
        });
        setTodoList(newListData);
    }

    const ToDoItemRenderer = () => {
        return listData.map((item) => {
            const isUpdate = item.index === task.index;
            return (
                <Fragment key={item.index}>
                    <div className='todo-item' key={item.index}>
                        <div className="row">
                            <div className="column">
                                <label>
                                    <input
                                        type='checkbox'
                                        onClick={checkboxHandler}
                                        name={item.index}
                                    />
                                    {item.subject}
                                </label>
                            </div>
                            <div className="column push-right-lg push-center-xs">
                                <Button color='info' onClick={isShowDetailHandler(item)}>Detail</Button>
                                <Button color='danger' onClick={removeTask(item)}>Remove</Button>
                            </div>
                        </div>
                    </div>
                    {isUpdate && updateItemComponent}
                </Fragment>
            )
        });
    }

    return (
        <div className="todo-list todo-wrapper">
            {ToDoItemRenderer()}
            <BuildActionComponent
                isShow={state.checkedList.length !== 0}
            />
        </div>
    )
}

export default ToDoList;
