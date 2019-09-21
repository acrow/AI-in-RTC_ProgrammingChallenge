package com.sunway.worktown.service;

import com.sunway.worktown.entity.UserEntity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

/**
 * 用户Service
 *
 * @author malin
 * @version 1.0
 */
@Service
public class UserService extends BaseRepositoryService<UserEntity> {

    /**
     * 根据登录名取得用户信息
     *
     * @param loginName 登录名
     * @return 用户信息
     */
    public UserEntity getOneByLoginName(String loginName) {
        // 设置查询条件
        Specification<UserEntity> spec = (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.<String>get("loginName"), loginName);

        // 查询
        return repository.findOne(spec).orElse(null);
    }
}
