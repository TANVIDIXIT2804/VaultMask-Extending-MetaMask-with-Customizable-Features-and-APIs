import React, { useState, useEffect } from 'react';

interface Props {
  data: [string, string][],
  loading: boolean,
  funcn: Function
}

const DataTable: React.FC<Props> = ({ data, loading, funcn }) => {
    const [tableData, setTableData] = useState(data);

    useEffect(() => {
        setTableData(data);
        console.log('data from inside DataTable', data);
    }, [data]);

    if (loading) {
        return <div>Loading...</div>;
    }
  return (
    <table style={{ border: '1px solid black', margin: '20px auto', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#dddddd' }}>
          <th style={{ border: '1px solid black', padding: '8px' }}>S.No.</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>FileName</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>CID</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Link</th>
          <th style={{ border: '1px solid black', padding: '8px' }}></th>
        </tr>
      </thead>
      <tbody>
        {tableData.map(([filename, cid], index) => (
          <tr key={index} style={{ border: '1px solid black' }}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{index+1}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{filename}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{cid}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}><a href= {`https://${cid}.ipfs.dweb.link/`} target='_blank'>Link</a></td>
            <td>
              <button onClick={() => funcn(filename, cid)}>Share</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
