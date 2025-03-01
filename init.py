import os;

def read_file(path):
    """Write content to a file."""
    with open(path, 'rb') as f:
        return f.read()

def write_file(path, content):
    """Write content to a file."""
    with open(path, 'wb') as f:
        f.write(content)

def init(repo):
    """Create directory for repo and initialize .git directory."""
    os.mkdir(repo)
    os.mkdir(os.path.join(repo, '.git'))
    for name in ['objects', 'refs', 'refs/heads']:
        os.mkdir(os.path.join(repo, '.git', name))
    write_file(os.path.join(repo, '.git', 'HEAD'),
               b'ref: refs/heads/master')
    print('initialized empty repository: {}'.format(repo))

    init("my_repo")

def hash_object(data, obj_type, write=True):
    # Compute hash of object data of given type and write to object store if "write" is True. Return SHA-1 object hash as hex string.
    header = '{} {}'.format(obj_type, len(data)).encode()
    full_data = header + b'\x00' + data
    sha1 = hashlib.sha1(full_data).hexdigest()
    if write:
        path = os.path.join('.git', 'objects', sha1[:2], sha1[2:])
        if not os.path.exists(path):
            os.makedirs(os.path.dirname(path), exist_ok=True)
            write_file(path, zlib.compress(full_data))
    return sha1
