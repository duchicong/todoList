import { PIORITY } from '../../constants';
import './style.css';

const SelectInput = (props) => {
    const { onChange, name, selectRef, value } = props;

    const optionRenderer = () => {
        return PIORITY.map((option, index) => (
            <option
                key={index}
                className='option'
                selected={value === option}
            >
                {option}
            </option>
        ))
    }

    return (
        <>
            <label className='Label'>Priority</label>
            <select className='Dropdown' onChange={onChange} name={name} ref={selectRef}>
                {optionRenderer()}
            </select>
        </>
    )
}

export default SelectInput;
