import { cn } from '@/lib/utils';
import CheckIcon from '../ui/check-icon';
import CrossIcon from '../ui/cross-icon';
import Loader from '../ui/loader';
import { FormState } from '@/app/utils';

interface FormResult {
  message: string;
  state: FormState;
}

const FormResult = ({ message, state }: FormResult) => {
  if (state === FormState.INITIAL) {
    return null;
  }

  if (state === FormState.LOADING) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const icon =
    state === FormState.SUCCESS ? <CheckIcon className="stroke-success-foreground" /> : <CrossIcon className="stroke-error-foreground" />;

  return (
    <div className={cn('flex w-full gap-2 px-2 py-4 rounded-lg', state === FormState.SUCCESS ? 'bg-success' : 'bg-error')}>
      <div>{icon}</div>
      <p>{message}</p>
    </div>
  );
};

export default FormResult;
