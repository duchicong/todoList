import { currentDate } from '../../utils';
import './style.css';

const DateInput = (props) => {
    const {
        label,
        value,
        name,
        onChange,
        classInput,
        dateRef
    } = props;

    return (
        <>
            {!!label && (<label className='Label'>{label}</label>)}
            <input
                type="date"
                defaultValue={value}
                name={name || 'date'}
                className={`DateInput ${classInput || ''}`}
                min={currentDate()}
                onChange={onChange}
                ref={dateRef}
            />
        </>
    )
}

export default DateInput;
