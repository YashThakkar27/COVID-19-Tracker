import React from 'react';
import './Table.css';
import numeral from 'numeral';

function Table({tableData}) {
    return (
        <div className="table">
            {tableData.map(country => (
                <tr>
                    <td><b>{country.country}</b></td>
                    <td>
                        <strong>{numeral(country.cases).format()}</strong>
                    </td>
                </tr>                
            ))}
        </div>
    )
}

export default Table;
