import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../Common/constants';
import Button from '@material-ui/core/Button';
import TableMatrix from '../Tablematrix/TableMatrix';

const Workplace = (props) => {
  const [workplaces, setWorkplaces] = useState([]);
  const [workplaceToView, setWorkplacesToView] = useState(null);
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
      })
      .catch((error) => error.message);
  }, []);

  return (
    <>
      <h1> workplaces: </h1>
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
          <TableMatrix key={workplaceToView.id} workplace={workplaceToView} />
        </>
      ) : null}
    </>
  );
};

export default Workplace;
