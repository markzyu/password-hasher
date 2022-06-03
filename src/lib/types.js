import PropTypes from 'prop-types';

const passwordShape = {
    name: PropTypes.string.isRequired,
    salt: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    hashMethod: PropTypes.string.isRequired,
    partsHash: PropTypes.arrayOf(PropTypes.string.isRequired),
    partsHashMethod: PropTypes.string,
}

export const TPassword = PropTypes.shape(passwordShape);
export const TPasswordWithHandler = PropTypes.shape({
    onDelete: PropTypes.func,
    onMore: PropTypes.func.isRequired,
    ...passwordShape,
});

export const TPasswordList = PropTypes.arrayOf(TPassword.isRequired);
export const TPasswordListWithHandler = PropTypes.arrayOf(TPasswordWithHandler.isRequired);