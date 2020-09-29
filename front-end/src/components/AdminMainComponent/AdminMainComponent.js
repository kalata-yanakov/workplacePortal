import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../Common/constants';
import Button from '@material-ui/core/Button';
import AdminMatrix from '../AdminMatrix/AdminMatrix';

const AdminMainComponent = (props) => {
  const [workplaces, setWorkplaces] = useState([]);
  const [workplaceToView, setWorkplacesToView] = useState(null);
  const [resetPage, setReset] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/country`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then((r) => r.json())
      .then((workplaces) => {
        if (workplaces.error) {
          throw new Error(workplaces.message);
        }
        setWorkplaces(workplaces);

        setWorkplacesToView(workplaces[0]);
      })
      .catch((error) => error.message);
  }, [resetPage]);

  return (
    <>
      <h1> AdminStuff: </h1>

      {workplaces.map((e) => {
        return (
          <Button
            variant='contained'
            key={e.id}
            onClick={() => setWorkplacesToView(e)}
            color='primary'
          >
            {e.name}
          </Button>
        );
      })}

      {workplaceToView === workplaces.find((e) => e === workplaceToView) ? (
        <>
          <AdminMatrix
            key={workplaceToView.id}
            workplace={workplaceToView}
            setWorkplacesToView={setWorkplacesToView}
            resetPage={resetPage}
            setReset={setReset}
          />
        </>
      ) : null}
    </>
  );
};

export default AdminMainComponent;
