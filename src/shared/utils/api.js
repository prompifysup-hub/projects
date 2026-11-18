import toast from 'shared/utils/toast';
import handle from 'shared/utils/server';

/*
 * Same interface as the original Jira clone's api.js, but instead of calling a Node server it is
 * answered in the browser by shared/utils/server, which reads and writes Prompify's tables.
 */
const api = (method, url, variables) => handle(method, url, variables);

const optimisticUpdate = async (url, { updatedFields, currentFields, setLocalData }) => {
  try {
    setLocalData(updatedFields);
    await api('put', url, updatedFields);
  } catch (error) {
    setLocalData(currentFields);
    toast.error(error);
  }
};

export default {
  get: (...args) => api('get', ...args),
  post: (...args) => api('post', ...args),
  put: (...args) => api('put', ...args),
  patch: (...args) => api('patch', ...args),
  delete: (...args) => api('delete', ...args),
  optimisticUpdate,
};
