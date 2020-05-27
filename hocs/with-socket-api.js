import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
// import { getMyOrders, getTheOrder } from './with-auth-once';
// import { myOrdersActions } from '../store/reducers/my-orders';


const socketApiUrl = process.env.REACT_APP_SOCKET_ENDPOINT || 'http://localhost:1337';

export const withSocketApi = WrappedComponent => {
  const Wrapper = props => {
    // const dispatch = useDispatch();

    useEffect(() => {
      const client = io.connect(socketApiUrl);
      // const id = user.fromServer ? user.fromServer.id : null;

      client.on('HELLO', payload => {
        console.log(payload);
        // TODO: dispatch could be used...
      });
      client.on('ARTICLE_UPDATED', payload => {
        console.log(payload);
        // TODO: dispatch could be used...
      });
      /*
      client.on('ORDER_UPDATED', payload => {
        console.log(payload);
        if (!payload.id) return;

        // console.log(myOrdersList);

        // const id = props.cookies.get('userId');
        const jwt = props.cookies.get('jwt');

        // Step 1: Need to requset for the order if necessary...
        const isThisCurrentArticle = [...myOrdersList].some(o => o.id == payload.id); // eslint-disable-line
        // NOTE: Нестрогое равенство из-за багов Strapi@beta

        if (isThisCurrentArticle) {
          // Step 2: For current user case.

          // Step 2.1: GET /orders/:id
          getTheOrder({ jwt, id: payload.id })
            .then(res => {
              // Step 2.2: Result received. Then we have to update it in redux store...
              // TODO: Преобразовать объект?

              dispatch(myOrdersActions.update({ ...res }));
            })
            .catch(err => {
              console.log('Result crashed.');
              console.log(err);
            });
        } else {
          console.log('socket emit ORDER_UPDATED ignored: Not my Order updated.');
        }
      });
      */

      return () => client.removeAllListeners();
    }, []);

    return <WrappedComponent {...props} />;
  }

  return Wrapper;
}