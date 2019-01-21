import { type } from "../container";

// First, let's define all interfaces
export const TRequestParamHandlerManager = type();
export interface TRequestParamHandlerManager {
    handleParams(paramList, request);
}

export const TRequestParamHandler = type();
export interface TRequestParamHandler {
    getParamValue(paramListItem, request);
}

export const TBodyRequestParamHandler = type(TRequestParamHandler);
export interface TBodyRequestParamHandler extends TRequestParamHandler {}

export const TQueryRequestParamHandler = type(TRequestParamHandler);
export interface TQueryRequestParamHandler extends TRequestParamHandler {}

export const THeaderRequestParamHandler = type(TRequestParamHandler);
export interface THeaderRequestParamHandler extends TRequestParamHandler {}