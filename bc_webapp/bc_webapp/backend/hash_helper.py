"""
created by WANG,Haomao on 2019-04-13.
"""
from abc import ABCMeta, abstractmethod


class _hash_helper(metaclass=ABCMeta):

    @abstractmethod
    def do_hash(self, raw_data):
        pass

    @abstractmethod
    def __reback_hash(self, hashed_data):
        pass

    @abstractmethod
    def __hash_function(self, raw_data):
        pass


class HashHelper(_hash_helper):

    def do_hash(self, raw_data):
        pass

    def __reback_hash(self, hashed_data):
        pass

    def __hash_function(self, raw_data):
        pass
