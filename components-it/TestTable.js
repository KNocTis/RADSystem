'use strict';

import React from 'react';
import TestRow from './TestRow.js';

// Properties
// testListArray ==> Array type, each item is a row of test

export default class TestTable extends React.component {
    
    createTestRows(item, index) {
        return <TestRow ticketNo={item.ticketNo} ticketRequestedTime={item.ticketRequestedTime} id={item.id} password={item.password} ticketStatus={item.ticketStatus} handler={item.handler} />
    }
    
    render () {
        return (
            <div class="jumbotron">
                <div class="table-container">
                    <table class="table table-borderless">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Time</th>
                                <th>ID</th>
                                <th>Password</th>
                                <th>Status</th>
                                <th>Handler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.testListArray.map(createTestRows);}
                        </tbody>
                    </table>
                </div>
            </div>
        );
}