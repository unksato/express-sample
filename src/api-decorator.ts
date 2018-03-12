
import * as express from 'express';
import * as Q from 'q'

export module Server {

    let d = Q.defer<void>();

    export let Api = (parser?: Function) => {
        return (clazz: any) => {
            clazz.parser = parser;
            clazz.router = express.Router();
            d.resolve();
        }
    }

    export module Route {
        /**
         * Add route definitions for all access methods
         * @param {string} path # Target Path 
         */
        export let ALL = (path: string) => {
            return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
                _addRoute('all', target, descriptor, path);
            };
        };

        /**
         * Add route definitions for get access methods
         * @param {string} path # Target Path 
         */
        export let GET = (path: string) => {
            return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
                _addRoute('get', target, descriptor, path);
            };
        };

        /**
         * Add route definitions for post access methods
         * @param {string} path # Target Path 
         */
        export let POST = (path: string) => {
            return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
                _addRoute('post', target, descriptor, path);
            };
        };

        /**
         * Add route definitions for put access methods
         * @param {string} path # Target Path 
         */
        export let PUT = (path: string) => {
            return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
                _addRoute('put', target, descriptor, path);
            };
        };


        /**
         * Add route definitions for delete access methods
         * @param {string} path # Target Path 
         */
        export let DELETE = (path: string) => {
            return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
                _addRoute('delete', target, descriptor, path);
            };
        };

        let _addRoute = (method: string, target: any, descriptor: PropertyDescriptor, path: string) => {
            d.promise.then(()=>{
                target.router.route(path)[method](descriptor.value);
            });
        };
    }
}