"""
created by WANG,Haomao on 2019-04-13.
"""

from .hash_helper import HashHelper


class BlockChainAPIHelper:
    def __init__(self):
        pass


class BlockChainHelper:
    __hash_helper: HashHelper
    __blockchain_API_helper: BlockChainAPIHelper

    def __init__(self):
        __hash_helper = HashHelper()
        __blockchain_API_helper = BlockChainAPIHelper()

    def insert_data(self,raw_data):
        data = self.__hash_helper.do_hash(raw_data)

        pass

    def search_data(self):
        pass

    # /
if __name__ == '__main__':
    pass