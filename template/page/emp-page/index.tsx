import React from 'react';
import localeCom from '@/components/localeCom';
import styles  from './index.module.less';

interface IProps {

}
const `{ComName}` = (props: IProps) => {
    return(
        <div className={styles.container}>
            `{ComName} page`
        </div>
    )
}
export default localeCom(`{ComName}`);