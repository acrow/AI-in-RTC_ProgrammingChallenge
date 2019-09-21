package com.sunway.worktown.service;

import com.sunway.worktown.config.WorktownProperties;
import com.sunway.worktown.entity.UserEntity;
import com.sunway.worktown.exception.CommonException;
import com.sunway.worktown.model.LoginInModel;
import com.sunway.worktown.util.AuthorizationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
 * 登录Service
 *
 * @author malin
 * @version 1.0
 */
@Service
public class LoginService extends BaseService {

    /**
     * 授权认证工具
     */
    @Autowired
    private AuthorizationUtil authorizationUtil;

    /**
     * RTS配置信息
     */
    @Autowired
    private WorktownProperties worktownProperties;

    /**
     * 用户Service
     */
    @Autowired
    private UserService userService;

    /**
     * 登录
     *
     * @param info 登录的输入信息
     * @return TOKEN信息
     */
    public String login(LoginInModel info) {
        // 取得用户信息
        UserEntity user = userService.getOneByLoginName(info.getLoginName());

        // 验证用户是否存在
        if (Objects.isNull(user)) {
            throw new CommonException("用户不存在！");
        }

        // 验证密码
        if (!user.getPassword().equals(info.getPassword())) {
            throw new CommonException("用户名或密码错误！");
        }

        // 发行TOKEN信息
        user.setPassword("*");
        return authorizationUtil.issueToken(user);
    }

    /**
     * 取得用户信息
     *
     * @return 用户信息
     */
    public UserEntity getUserInfo() {
        return authorizationUtil.getUserInfo();
    }

    /**
     * 取得配置信息
     *
     * @return 配置信息
     */
    public WorktownProperties getConfigInfo() {
        return worktownProperties;
    }

    /**
     * 取得TOKEN
     *
     * @return TOKEN
     */
    public String getToken() {
        return authorizationUtil.issueToken(authorizationUtil.getUserInfo());
    }
}
