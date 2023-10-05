import React from "react";
import { Input, Table } from "reactstrap";

function KanaTable({ kanaArr, onChange, startIndex, checkedCols }) {
  //transpose a 2-d Array
  const transpose = (matrix) => {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  };

  return (
    <Table bordered className="table-dark text-center">
      <thead>
        <tr>
          {kanaArr.map((v, i) => (
            <th key={i + startIndex}>
              <Input
                checked={checkedCols.has(i + startIndex) ? true : false}
                type="checkbox"
                value={i + startIndex}
                onChange={onChange}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {transpose(kanaArr).map((kanaRow, i) => (
          <tr key={i + startIndex}>
            {kanaRow.map((kana, i) => (
              <td key={i + startIndex}>
                <p>
                  {Object.keys(kana)[0]}
                </p>
                <p>
                  {kana[Object.keys(kana)[0]]}
                </p>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default KanaTable;