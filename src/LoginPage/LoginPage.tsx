import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, selectUser } from '../store/slices/user/user';
import { AppDispatch } from '../store';

const style = () => {
  return {
    position: 'absolute',
    top: '70%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
  };
};

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(selectUser);

  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [username, setUsername] = useState('');
  const [pwConfirm, setPwConfirm] = useState<string>('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const checkEmail = (asValue: string) => {
    const regExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regExp.test(asValue);
  };

  const checkPW = (asValue: string) => {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
  };

  const onKeyPress = (e: { key: string }) => {
    if (e.key == 'Enter') {
      onClickLogin();
    }
  };

  const onClickMode = () => {
    setEmail('');
    setLoginPassword('');
    setPwConfirm('');
    setUsername('');
    setErrorText('');
    setIsLoginMode(!isLoginMode);
  };

  const onClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onClickShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const onChangeId = async (id: string) => {
    setEmail(id);

    if (checkEmail(id) || isLoginMode) {
      setErrorText('');
    } else {
      setErrorText('이메일의 형식을 다시 확인해주세요');
    }
  };

  const onChangePw = async (pw: string) => {
    setLoginPassword(pw);

    if (checkPW(pw) || isLoginMode) {
      setErrorText('');
    } else {
      setErrorText('비밀번호의 형식을 다시 확인해주세요');
    }
  };

  const onChangePwConfirm = async (pw: string) => {
    setPwConfirm(pw);

    if (loginPassword === pw) {
      setErrorText('');
    } else {
      setErrorText('비밀번호가 일치하지 않습니다.');
    }
  };

  const onClickLogin = async () => {
    const data = {
      email: email,
      password: loginPassword,
    };
    if (email !== '' && loginPassword !== '') {
      const result = await dispatch(loginUser(data));
      if (result.type === `${loginUser.typePrefix}/fulfilled`) {
        console.log(userState.accessToken);
      } else {
        setErrorText('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    }
  };

  const onClickRegister = async () => {
    const data = {
      email: email,
      password: loginPassword,
      username: username,
    };

    const result = await dispatch(registerUser(data));
    if (result.type === `${registerUser.typePrefix}/fulfilled`) {
      console.log(userState.accessToken);
      onClickMode();
    } else {
      setErrorText('중복된 이메일입니다.');
    }
  };

  return (
    <Stack spacing={2} sx={style}>
      <TextField
        label="이메일"
        variant="standard"
        helperText={!isLoginMode && '이메일을 입력해주세요'}
        value={email}
        onChange={(e) => {
          onChangeId(e.target.value);
        }}
        onKeyPress={onKeyPress}
        sx={{
          '& label.Mui-focused': {
            color: 'secondary.light',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'secondary.light',
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'secondary.light',
            },
          },
        }}
      />
      <FormControl
        variant="standard"
        sx={{
          '& label.Mui-focused': {
            color: 'secondary.light',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'secondary.light',
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'secondary.light',
            },
          },
        }}
      >
        <InputLabel>비밀번호</InputLabel>
        <Input
          type={showPassword ? 'text' : 'password'}
          data-testid="password"
          value={loginPassword}
          onChange={(e) => {
            onChangePw(e.target.value);
          }}
          onKeyPress={onKeyPress}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                data-testid="showPassword"
                tabIndex={-1}
                onClick={onClickShowPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText>
          {!isLoginMode && (
            <>
              {' '}
              영문과 숫자 조합의 8-20자의 비밀번호를 설정해주세요. <br />{' '}
              특수문자(!@#$%^&*)도 사용 가능합니다.{' '}
            </>
          )}
        </FormHelperText>
      </FormControl>
      {!isLoginMode && (
        <FormControl
          variant="standard"
          sx={{
            '& label.Mui-focused': {
              color: 'secondary.light',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'secondary.light',
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: 'secondary.light',
              },
            },
          }}
        >
          <InputLabel>비밀번호 확인</InputLabel>
          <Input
            type={showPasswordConfirm ? 'text' : 'password'}
            value={pwConfirm}
            data-testid="pwconfirm"
            onChange={(e) => {
              onChangePwConfirm(e.target.value);
            }}
            onKeyPress={onKeyPress}
            endAdornment={
              <InputAdornment position="end">
                <IconButton tabIndex={-1} onClick={onClickShowPasswordConfirm}>
                  {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      )}
      {!isLoginMode && (
        <FormControl
          variant="standard"
          sx={{
            '& label.Mui-focused': {
              color: 'secondary.light',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'secondary.light',
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: 'secondary.light',
              },
            },
          }}
        >
          <InputLabel>닉네임</InputLabel>
          <Input
            type={'text'}
            value={username}
            data-testid="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onKeyPress={onKeyPress}
          />
        </FormControl>
      )}
      {isLoginMode ? (
        <Button
          variant="text"
          onClick={onClickLogin}
          sx={{
            bgcolor: 'primary.dark',
            borderRadius: 3,
            boxShadow: 3,
            '&:hover': {
              backgroundColor: 'secondary.main',
              boxShadow: 2,
            },
          }}
        >
          <Typography color="text.primary">로그인</Typography>
        </Button>
      ) : (
        <Button
          variant="text"
          onClick={onClickRegister}
          data-testid="register"
          disabled={
            !checkEmail(email) ||
            !checkPW(loginPassword) ||
            loginPassword !== pwConfirm
          }
          sx={{
            bgcolor: 'primary.dark',
            borderRadius: 3,
            boxShadow: 3,
            '&:hover': {
              backgroundColor: 'secondary.main',
              boxShadow: 2,
            },
            '&:disabled': {
              backgroundColor: 'secondary.dark',
              boxShadow: 2,
            },
          }}
        >
          <Typography color="text.primary">회원가입</Typography>
        </Button>
      )}
      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <Typography color="error.main" variant="body2" sx={{ width: 0.6 }}>
          {errorText}
        </Typography>
        <Typography
          color="text.primary"
          variant="body2"
          align="right"
          onClick={onClickMode}
          sx={{
            width: 0.4,
            'word-break': 'keep-all',
            cursor: 'pointer',
            '&:hover': {
              color: 'text.secondary',
            },
          }}
        >
          {isLoginMode ? '회원가입 하러가기' : '로그인 하러가기'}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
