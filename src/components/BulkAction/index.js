import { Fragment } from 'react';
import { Button } from '../';
import './style.css';

const BulkAction = (props) => {
    const { isShow } = props;

    if (!isShow) return;
    return (
        <Fragment>
            <div className='bulk-action'>
                <div className="row">
                    <div className="column">
                        <p>Bulk Action:</p>
                    </div>
                    <div className="column push-right-lg push-center-xs">
                        <Button color='info'>Detail</Button>
                        <Button color='danger'>Remove</Button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default BulkAction;
