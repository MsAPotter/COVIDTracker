import React from "react";
import "../css/Table.css";
import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map((country ) => (
        // <table>
        //   <tbody>
            <tr>
              <td>{country.country}</td>
              <td>
                {/* <strong>{country.cases.toLocaleString()}</strong> */}
                <strong>{numeral(country.cases).format("0,0")}</strong>
              </td>
            </tr>
        //    </tbody>
        //  </table>
      ))}
    </div>
  );
}

export default Table;
