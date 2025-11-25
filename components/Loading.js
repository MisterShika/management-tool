import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-32">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-blue-500" />
        </div>
    );
}