import './style.css';

const COLOR = ['default', 'success', 'danger', 'info'];

const Button = (props) => {
    const {
        className,
        children,
        color,
        block,
        onClick,
        disabled,
        rest
    } = props;

    const colorTypeHandler = () => {
        if (!COLOR.includes(color)) return '';

        const type = `btn-${color}`;
        return type;
    }

    const blockHandler = () => {
        if (typeof block === 'boolean')
            return 'btn-block';
        else return '';
    }

    return (
        <button
            className={`btn ${colorTypeHandler()} ${className || ''} ${blockHandler()}`}
            onClick={onClick}
            disabled={disabled ? 'disabled' : null}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button;
