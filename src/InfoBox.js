import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({title, curCases, totalCases, active, isRed, ...props}) {
    return (
        <Card
            onClick={props.onClick}
            className={`InfoBox ${active && "InfoBox--selected"} ${isRed && "InfoBox--red"}`}
        >
            <CardContent>
                {/* Title */}
                <Typography color="textsecondary" gutterBottom>
                    {title}
                </Typography>

                {/* curCases */}
                <h2 className={`InfoBox__cases ${!isRed && "InfoBox__cases--green"}`}>{curCases}</h2>

                {/* TotalCases */}
                <Typography className="InfoBox__totalCase" color="textsecondary">
                    {totalCases} Total
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox;
