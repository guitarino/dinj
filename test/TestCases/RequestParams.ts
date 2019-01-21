import {
    TBodyRequestParamHandler,
    TQueryRequestParamHandler,
    THeaderRequestParamHandler,
    TRequestParamHandlerManager,
    TRequestParamHandler
} from "./RequestParams.types";
import { inject, multi, dependency } from "../container";

export const hooks = {
    BodyRequestParamHandler: {
        constructor: ()=>{}
    },
    QueryRequestParamHandler: {
        constructor: ()=>{}
    },
    HeaderRequestParamHandler: {
        constructor: ()=>{}
    },
    RequestParamHandlerManager: {
        constructor: ()=>{}
    }
};

// Second, let's define all implementations
@dependency(TBodyRequestParamHandler)
class BodyRequestParamHandler implements TBodyRequestParamHandler {
    constructor() {
        hooks.BodyRequestParamHandler.constructor.call(this);
    }

    getParamValue(paramListItem, request) {}
}

@dependency(TQueryRequestParamHandler)
class QueryRequestParamHandler implements TQueryRequestParamHandler {
    constructor() {
        hooks.QueryRequestParamHandler.constructor.call(this);
    }

    getParamValue(paramListItem, request) {}
}

@dependency(THeaderRequestParamHandler)
class HeaderRequestParamHandler implements THeaderRequestParamHandler {
    constructor() {
        hooks.HeaderRequestParamHandler.constructor.call(this);
    }

    getParamValue(paramListItem, request) {}
}

@dependency(TRequestParamHandlerManager)
class RequestParamHandlerManager implements TRequestParamHandlerManager {
    @inject(TRequestParamHandler) @multi
    private paramHandlers: TRequestParamHandler[];
    
    constructor() {
        hooks.RequestParamHandlerManager.constructor.call(this);
    }

    handleParams(paramList, request) {}
}