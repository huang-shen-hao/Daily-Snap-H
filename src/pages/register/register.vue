<script lang="ts" setup>
import { sendEmailCode, verifyCaptcha, generateCaptcha, registerAndsaveUserInfo } from '@/utils/api'
const registerForm = reactive({
  email: '',
  username: '',
  password: '',
  code: ''
})

const rules = reactive({
  username: [{ required: true, errorMessage: '请输入昵称', trigger: 'blur' }],
  email: {
    rules: [
      { required: true, errorMessage: '请输入邮箱', trigger: 'blur' },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          // eslint-disable-next-line no-useless-escape
          let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
          if (!emailReg.test(value)) {
            callback('邮箱格式不正确，请重新填写')
          }
        }
      }
    ]
  },
  code: [{ required: true, errorMessage: '请输入', trigger: 'blur' }],
  password: {
    rules: [
      { required: true, errorMessage: '请输入密码', trigger: 'blur' },
      { min: 6, max: 16, errorMessage: '密码长度在6-16位之间', trigger: ['blur', 'change'] }
    ]
  }
})

// 是否发二维码的tag
const codeTag = ref<boolean>(true)
const key = ref<string>('') //人机校验id
const svg = ref<string>(
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAsMCwxNTAsNTAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGYwZjAiLz48cGF0aCBmaWxsPSIjN2YxZGUxIiBkPSJNMzEuMzggNDAuMzJMMzEuNDYgNDAuMzlMMzEuNTMgNDAuNDdRMjcuMzUgNDAuNTkgMjYuMzYgMzguMjdMMjYuMzkgMzguMzBMMjYuNDEgMzguMzJRMjcuMTUgMzcuMzQgMjguNzEgMzUuNTVMMjguNjUgMzUuNDlMMjguNzkgMzUuNjRRMjkuMjkgMzcuNjUgMzIuMjkgMzcuNzdMMzIuMTIgMzcuNTlMMzIuMTkgMzcuNjZRMzUuNjIgMzcuNzggMzcuMjYgMzYuNDVMMzcuMTcgMzYuMzZMMzcuMzMgMzYuNTJRMzguNjQgMzQuODIgMzguNTYgMzIuMTJMMzguNTIgMzIuMDhMMzguNTcgMzIuMTNRMzguMzggMjcuMDIgMzMuNTggMjcuMjVMMzMuNjggMjcuMzZMMzMuNjQgMjcuMzFRMzAuNzEgMjcuMzUgMjguOTYgMjguNjFMMjguOTYgMjguNjFMMjguNzQgMjguNTRMMjguNDggMjguMzVMMjguNTggMjguNDZRMjguODEgMjUuMTkgMjguNzAgMjIuNDVMMjguODAgMjIuNTVMMjguNzkgMjIuNTRRMjguNTcgMTkuODAgMjguMjMgMTYuNDlMMjguMzYgMTYuNjNMMjguMjcgMTYuNTNRMzEuOTUgMTcuNTEgMzUuNzYgMTcuNDBMMzUuNjQgMTcuMjlMMzUuODIgMTcuNDdRMzkuNTYgMTcuMzIgNDMuMTQgMTYuMDZMNDMuMDUgMTUuOThMNDIuNTAgMTcuNTFMNDIuNTYgMTcuNThRNDIuMjIgMTguMzAgNDIuMDMgMTkuMTRMNDIuMDEgMTkuMTJMNDEuOTggMTkuMDlRMzguOTMgMjAuMTkgMzUuMDQgMjAuMTlMMzUuMTEgMjAuMjZMMzUuMDAgMjAuMTRRMzMuNzAgMjAuMjkgMzIuMjEgMjAuMTRMMzIuMDggMjAuMDFMMzIuMTEgMjAuMDNRMzIuMDAgMjAuNjkgMzEuNjYgMjUuMTRMMzEuNzMgMjUuMjFMMzEuODAgMjUuMjhRMzIuNTYgMjQuNzQgMzQuNjEgMjQuNTlMMzQuNjkgMjQuNjdMMzQuNTIgMjQuNTBRMzguMzQgMjQuODIgMzkuNzkgMjYuNDlMMzkuODUgMjYuNTZMMzkuODUgMjYuNTVRNDEuMDYgMjcuOTIgNDEuMzMgMzEuNzZMNDEuMzYgMzEuODBMNDEuNTEgMzEuOTRRNDEuNjcgMzYuMDMgNDAuNDYgMzguMDVMNDAuNTIgMzguMTFMNDAuNTAgMzguMTBRMzguMzYgMzkuODggMzUuMDUgNDAuMTFMMzUuMTggNDAuMjNMMzUuMTMgNDAuMThRMzQuMDMgNDAuMTUgMzEuMzYgNDAuMzBaTTM3LjU4IDQyLjc1TDM3LjQ2IDQyLjYzTDM3LjQyIDQyLjU5UTQwLjk2IDQyLjc4IDQyLjg2IDQxLjY4TDQyLjg5IDQxLjcxTDQyLjg0IDQxLjY1UTQzLjc4IDQwLjA3IDQzLjc4IDM3Ljk4TDQzLjc3IDM3Ljk3TDQzLjgwIDM4LjAwUTQzLjczIDM0Ljg2IDQyLjc4IDMwLjc1TDQyLjg1IDMwLjgyTDQyLjg0IDMwLjgwUTQyLjQzIDI5LjAyIDQxLjIxIDI3LjYxTDQxLjI0IDI3LjY0TDQxLjMzIDI3Ljc2TDQwLjk3IDI3LjM0TDQwLjY3IDI3LjE4TDQwLjc0IDI3LjI2UTQwLjQ3IDI2LjU3IDM5LjgyIDI1Ljg4TDM5LjczIDI1Ljc5TDM5Ljg2IDI1Ljk1TDM5Ljc2IDI1Ljg1UTM4LjIxIDI0LjE1IDM0LjUyIDI0LjE1TDM0LjY2IDI0LjMwTDM0LjI1IDI0LjE2TDM0LjMxIDI0LjIxUTM0LjM2IDIzLjYyIDM0LjU1IDIyLjUxTDM0LjU1IDIyLjUxTDM0LjYwIDIyLjU2UTM5LjUxIDIyLjYwIDQzLjU1IDIwLjk2TDQzLjU2IDIwLjk4TDQzLjY0IDIxLjA2UTQ0LjA3IDE5LjY2IDQ1LjAyIDE2Ljg0TDQ1LjAyIDE2Ljg0TDQyLjk0IDE3LjgwTDQyLjc3IDE3LjYzUTQzLjMyIDE2LjY2IDQzLjgyIDE1LjUyTDQzLjc5IDE1LjUwTDQzLjgwIDE1LjUxUTM5LjgxIDE2LjgwIDM1LjY5IDE2Ljg4TDM1LjgzIDE3LjAxTDM1LjgyIDE3LjAwUTMxLjc2IDE3LjE3IDI3LjgwIDE2LjA3TDI3Ljc2IDE2LjAzTDI3Ljc0IDE2LjAwUTI4LjMwIDIwLjMwIDI4LjMwIDI0LjcyTDI4LjQ1IDI0Ljg3TDI4LjQwIDI0LjgyUTI4LjQxIDI2LjczIDI4LjMwIDI4LjYzTDI4LjI2IDI4LjYwTDI4LjIwIDI4LjUzUTI4LjU4IDI4Ljg0IDI5LjE1IDI5LjE0TDI5LjE0IDI5LjEzTDI5LjA2IDI5LjA1UTI5LjQ1IDI4Ljg3IDMwLjA5IDI4LjUzTDMwLjE0IDI4LjU3TDMwLjExIDI4LjU1UTI5Ljk4IDI5LjIxIDI5Ljc1IDMwLjczTDI5LjkwIDMwLjg4TDI5Ljc5IDMwLjc3UTMwLjE3IDMwLjkyIDMwLjU5IDMxLjE1TDMwLjc2IDMxLjMyTDMwLjcxIDMxLjI3UTMzLjUzIDI5LjU2IDM1LjM5IDI5LjU2TDM1LjM1IDI5LjUyTDM1LjIzIDI5LjQwUTM2LjYzIDI5LjQ3IDM3LjgxIDMwLjEyTDM3LjgzIDMwLjEzTDM3LjgyIDMwLjEyUTM4LjI3IDMxLjI2IDM4LjMxIDMyLjIxTDM4LjIzIDMyLjEzTDM4LjMyIDMyLjIyUTM4LjM0IDM0Ljc1IDM3LjMxIDM1Ljg2TDM3LjE5IDM1Ljc0TDM3LjI3IDM1LjgxUTM1Ljg5IDM3LjAzIDMzLjY1IDM3LjI2TDMzLjYwIDM3LjIxTDMzLjczIDM3LjM0UTMyLjc4IDM3LjQyIDMyLjEwIDM3LjM0TDMxLjk2IDM3LjIwTDMxLjk5IDM3LjI0UTMxLjE4IDM3LjE1IDMwLjQyIDM2LjgxTDMwLjQyIDM2LjgxTDMwLjI4IDM2LjQ3TDMwLjMwIDM2LjczTDMwLjM0IDM2Ljc3UTI5LjUyIDM2LjI1IDI4Ljk5IDM0LjkyTDI4Ljg5IDM0LjgyTDI4Ljg5IDM0LjgyUTI3LjY1IDM2LjMzIDI1Ljk4IDM4LjQ2TDI1LjkzIDM4LjQxTDI2LjAwIDM4LjQ3UTI2LjE4IDM5LjAwIDI3LjAyIDM5Ljk1TDI2Ljk5IDM5LjkzTDI3LjA5IDQwLjAyUTI4LjEwIDQxLjc5IDMwLjkxIDQyLjI5TDMwLjg4IDQyLjI2TDMwLjk2IDQyLjM0UTMyLjE0IDQyLjU2IDM3LjUwIDQyLjY3WiIvPjxwYXRoIGZpbGw9IiM2YjhlN2MiIGQ9Ik03Mi41MiAzOS40NUw3Mi42MiAzOS41NUw3Mi41MCAzOS40M1E3MS43NiAzOS4zNCA3MS4wOCAzOS4zOEw3MS4yNSAzOS41NUw3MS4xOSAzOS40OVE3MC40MiAzOS41MiA2OS43NCAzOS41Mkw2OS44MCAzOS41OEw2OS43MiAzOS41MFE3MC4yNyAzNi4xOCA3MC4yNyAzMi43NUw3MC4yMCAzMi42N0w3MC4xNSAzMi42M1E2OC4zMiAzMi42NyA2Ny40MSAzMi42N0w2Ny41NyAzMi44M0w2Ny40MSAzMi42N1E2Ni42MyAzMi43MyA2NC44MCAzMi42NUw2NC42NyAzMi41Mkw2NC44MSAzMi42NlE2NC43MSAzMi4yNiA2NC41MiAyOS43OEw2NC41NSAyOS44MEw2NC42NyAyOS45MlE2Ny4yMCAzMC40NCA3MC4xNyAzMC40NEw3MC4yMCAzMC40N0w3MC4xMyAzMC40MFE2OS44NCAyNS45NiA2OS40MiAyMy4zN0w2OS41MCAyMy40NUw2OS40NyAyMy40MlE3MC4xOSAyMy40NSA3MC45OSAyMy40NUw3MS4xMCAyMy41Nkw3Mi43NCAyMy41Nkw3Mi43MCAyMy41M1E3Mi40MiAyNy43NCA3Mi40MiAzMC4zM0w3Mi40MSAzMC4zMkw3Mi40MCAzMC4zMVE3NC41OCAzMC4zMiA3Ny43OCAyOS45OEw3Ny44NyAzMC4wN0w3Ny43NyAyOS45N1E3Ny42OSAzMS4zNCA3Ny42OSAzMi41NUw3Ny42OSAzMi41NUw3Ny43NCAzMi42MFE3Ny40MyAzMi41NiA3Ni42MyAzMi41OUw3Ni43NiAzMi43M0w3Ni42NCAzMi42MFE3NS43NCAzMi43MCA3NS4xMyAzMi43NEw3NS4wMSAzMi42Mkw3NS4wMCAzMi42MFE3NS4wNiAzMi42NyA3Mi40MCAzMi42N0w3Mi40MiAzMi42OUw3Mi4zOCAzNi4wOEw3Mi40NSAzNi4xNVE3Mi4zNiAzNy42OSA3Mi40NyAzOS40MVpNNzguMzYgMjkuNjVMNzguMjIgMjkuNTBMNzguMjcgMjkuNTZRNzYuMzUgMjkuODQgNzQuNDggMjkuOTJMNzQuNTMgMjkuOTZMNzQuNTkgMzAuMDJRNzQuNzEgMjYuNzUgNzUuMTIgMjQuODlMNzUuMjEgMjQuOTdMNzUuMjkgMjUuMDVRNzQuNDcgMjQuOTkgNzMuMDYgMjUuMTRMNzMuMDIgMjUuMTFMNzMuMjcgMjMuMTFMNzMuMTYgMjMuMDBRNzAuNjEgMjMuMDggNjguOTMgMjIuOTZMNjkuMDEgMjMuMDNMNjguOTUgMjIuOThRNjkuNjMgMjYuMjAgNjkuODIgMzAuMDlMNjkuNzUgMzAuMDJMNjkuNzEgMjkuOThRNjcuODkgMjkuODcgNjQuMTkgMjkuMjZMNjQuMzIgMjkuMzlMNjQuMzMgMjkuNDBRNjQuNTQgMzAuNTIgNjQuNTQgMzMuMTRMNjQuNDUgMzMuMDVMNjYuMDEgMzMuMDlMNjUuOTUgMzMuMDNRNjUuOTggMzMuNzkgNjUuODMgMzUuMjBMNjUuOTcgMzUuMzRMNjkuOTMgMzUuMDdMNjkuODQgMzQuOTlRNjkuNjAgMzguMTMgNjkuMzAgMzkuOTZMNjkuMzcgNDAuMDRMNjkuMzUgNDAuMDFRNzAuMTUgNDAuMDUgNzEuNTYgMzkuOTRMNzEuMzggMzkuNzVMNzEuNTAgMzkuODhRNzEuNTIgNDAuNTkgNzEuNDkgNDEuOTJMNzEuNTEgNDEuOTRMNzEuNDkgNDEuOTJRNzEuOTQgNDEuODQgNzUuNTYgNDEuOTlMNzUuNTAgNDEuOTRMNzUuNjcgNDIuMTFRNzQuNzAgMzguOTcgNzQuNDcgMzUuMDFMNzQuNDIgMzQuOTVMNzQuNTIgMzUuMDVRNzcuODIgMzUuMTMgNzkuOTIgMzUuNTFMNzkuODEgMzUuMzlMNzkuNzUgMzUuMzRRNzkuNjYgMzQuNDggNzkuNjYgMzMuNTNMNzkuNTkgMzMuNDdMNzkuNjIgMzEuNTlMNzkuNjMgMzEuNjBRNzkuMzUgMzEuNTUgNzguODIgMzEuNTlMNzguOTcgMzEuNzRMNzguMDMgMzEuNjBMNzcuOTkgMzEuNTZRNzguMTMgMzAuOTAgNzguMjUgMjkuNTNaIi8+PHBhdGggZD0iTTkgMTYgQzczIDE2LDc4IDQ2LDEzNyA0NCIgc3Ryb2tlPSIjZWQ4MjljIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTYgMTkgQzYwIDI1LDU3IDIyLDEzNSA0IiBzdHJva2U9IiM1OGU4YTAiIGZpbGw9Im5vbmUiLz48cGF0aCBmaWxsPSIjMjVkZWIwIiBkPSJNMTA4LjAyIDI5LjEyTDEwOC4xMSAyOS4yMUwxMDguMDQgMjkuMTRRMTA2LjIyIDI5LjE5IDEwNS4wMCAzMC41MkwxMDQuOTUgMzAuNDdMMTA1LjAzIDMwLjU1UTEwMy43MCAzMS43NyAxMDMuNTUgMzMuNjdMMTAzLjY2IDMzLjc4TDEwMy41OCAzMy43MFExMDMuNDIgMzUuODcgMTA0LjY0IDM2Ljg4TDEwNC43NiAzNi45OUwxMDQuNTggMzYuODFRMTA1LjkyIDM3Ljk1IDEwOC4wNSAzNy44N0wxMDcuOTEgMzcuNzNMMTA4LjAxIDM3LjgzUTExMC4zNyAzNy43MSAxMTEuMzIgMzYuNzZMMTExLjM3IDM2LjgxTDExMS4xOSAzNi42M1ExMTIuMjMgMzUuMTkgMTEyLjExIDMzLjM2TDExMi4xOCAzMy40M0wxMTIuMjggMzMuNTNRMTEyLjA4IDMxLjU4IDExMC45OSAzMC4zOEwxMTEuMDUgMzAuNDRMMTExLjAzIDMwLjQyUTEwOS45NSAyOS4yMiAxMDguMTIgMjkuMjJaTTEwOC4wNiAxOS43NUwxMDguMDIgMTkuNzJMMTA4LjEwIDE5LjgwUTEwNi41OCAxOS41NyAxMDUuMjQgMjAuMDZMMTA1LjI3IDIwLjA5TDEwNS4yOSAyMC4xMVExMDQuMTAgMjEuMDEgMTA0LjMzIDIyLjg4TDEwNC4xNiAyMi43MUwxMDQuMzMgMjIuODhRMTA0LjgyIDI2LjYwIDEwOC4xNyAyNi42MEwxMDguMDkgMjYuNTNMMTA4LjE2IDI2LjU5UTEwOS42OCAyNi43NCAxMTAuNjYgMjUuNjBMMTEwLjY0IDI1LjU3TDExMC41OCAyNS41MVExMTEuNTQgMjQuMzQgMTExLjU4IDIyLjc4TDExMS43MyAyMi45M0wxMTEuNTggMjIuNzhRMTExLjc1IDIxLjEyIDExMS4wMiAyMC41MUwxMTEuMTAgMjAuNTlMMTExLjAxIDIwLjUwUTEwOS40MyAxOS43NSAxMDguMTMgMTkuODNaTTEwNy42OSA0MC4yMUwxMDcuNjkgNDAuMjFMMTA0LjgwIDQwLjM3TDEwNC42OCA0MC4yNFExMDMuMjcgNDAuMzYgMTAxLjk0IDM5LjQ5TDEwMS44OSAzOS40NEwxMDEuOTYgMzkuNTFRMTAwLjU4IDM4LjM1IDEwMC43MyAzNS41MEwxMDAuNTcgMzUuMzRMMTAwLjcyIDM1LjQ4UTEwMS4xMCAyOC41NiAxMDQuNzIgMjcuNTdMMTA0Ljc0IDI3LjYwTDEwNC42OCAyNy41M1ExMDIuNTAgMjYuNzIgMTAxLjE2IDIxLjM1TDEwMS4yMCAyMS4zOUwxMDEuMTMgMjEuMzJRMTAwLjc2IDE5Ljg4IDEwMC44NCAxOS4wOEwxMDAuNzUgMTkuMDBMMTAwLjkzIDE5LjE4UTEwMS4wOSAxNi45MCAxMDQuNzggMTYuODZMMTA0Ljc2IDE2Ljg0TDEwNC45MyAxNy4wMVExMDkuMDQgMTYuODEgMTEwLjQ4IDE3LjAwTDExMC41NSAxNy4wN0wxMTAuNjEgMTcuMTNRMTE0LjMxIDE3LjUyIDExNC43NyAxOS41NEwxMTQuODMgMTkuNjBMMTE0Ljg2IDE5LjYzUTExNC45MyAyMC4xOSAxMTQuOTMgMjAuNTdMMTE1LjA0IDIwLjY4TDExNS4wMyAyMC42OFExMTQuODYgMjEuMTggMTE0LjY2IDIxLjc5TDExNC42OSAyMS44MkwxMTQuODMgMjEuOTZRMTE0LjE2IDI2LjEyIDExMS4yMyAyNy42NEwxMTEuMTMgMjcuNTVMMTExLjMwIDI3LjcxUTExNC43MyAyOC40NSAxMTUuMjMgMzMuNzRMMTE1LjIwIDMzLjcxTDExNS4xNSAzMy42NlExMTUuMTYgMzMuODIgMTE1LjE5IDM1LjExTDExNS4yMSAzNS4xM0wxMTUuMzMgMzUuMjVRMTE1LjQxIDM3Ljk5IDExMy44MSAzOS4wNkwxMTMuNjYgMzguOTFMMTEzLjY5IDM4Ljk0UTExMi4zMyAzOS44MiAxMDcuNzYgNDAuMjhaTTEwOS45OCA0Mi41NEwxMTAuMTEgNDIuNjdMMTEzLjM5IDQyLjY3TDExMy40MCA0Mi42OFExMTUuMjMgNDIuODggMTE2Ljc1IDQyLjE1TDExNi42NyA0Mi4wN0wxMTYuNjggNDIuMDhRMTE3Ljc2IDQxLjI5IDExNy44MyAzOS40M0wxMTcuODYgMzkuNDVMMTE3LjgzIDM5LjQzUTExNy44NSAzOC4zMCAxMTcuNDcgMzYuMzZMMTE3LjQ4IDM2LjM4TDExNy41MiAzNi40MVExMTYuNjAgMzEuNzcgMTE0LjUxIDI5LjkwTDExNC40MyAyOS44MkwxMTQuNDEgMjkuNjFMMTE0LjA1IDI5LjE4TDExNC4wNCAyOS4wNUwxMTQuMDAgMjkuMDFRMTE1LjYzIDI3LjYzIDExNi41NCAyMy40OEwxMTYuNTYgMjMuNTBMMTE2LjU3IDIzLjUxUTExNi40NiAyMy4wMiAxMTYuNTQgMjIuMThMMTE2LjYyIDIyLjI2TDExNi42MSAyMi4yNlExMTYuNzEgMjEuNTkgMTE2LjYzIDIwLjk4TDExNi42NSAyMS4wMEwxMTYuNjggMjEuMDNRMTE2LjQ3IDE5LjUyIDExNS4yOSAxOS4wM0wxMTUuMzMgMTkuMDdMMTE1LjI3IDE4Ljk3TDExNS4xNyAxOC45NUwxMTUuMTUgMTguOTNRMTE0Ljk0IDE4LjI2IDExMy43NiAxNy40NkwxMTMuNjIgMTcuMzJMMTEzLjY1IDE3LjMxTDExMy42NCAxNy4zMVExMTEuNjcgMTYuNjMgMTA3LjYwIDE2LjQ0TDEwNy43NSAxNi41OUwxMDcuNjUgMTYuNDlRMTA2LjEzIDE2LjQxIDEwNC43NiAxNi41M0wxMDQuNjUgMTYuNDJMMTA0LjY5IDE2LjQ2UTEwMy44NiAxNi40NyAxMDIuNTcgMTYuNjJMMTAyLjY2IDE2LjcxTDEwMi43NCAxNi43OVExMDAuNjMgMTcuMDAgMTAwLjQwIDE4LjY0TDEwMC4zOCAxOC42MkwxMDAuNTAgMTguNzVRMTAwLjQ0IDE5LjIxIDEwMC40NyAyMC4wMUwxMDAuNTYgMjAuMTBMMTAwLjUwIDIwLjA0UTEwMC42MCAyMC41NSAxMDEuMTcgMjIuOTFMMTAxLjIyIDIyLjk2TDEwMS4yMSAyMi45NlExMDEuOTMgMjYuMTEgMTAzLjY4IDI3LjQ1TDEwMy43NiAyNy41M0wxMDMuNjkgMjcuNDVMMTAzLjcwIDI3LjQ3UTEwMC45MiAyOC43NiAxMDAuMzkgMzMuOTRMMTAwLjQ4IDM0LjAzTDEwMC40OSAzNC4wNFExMDAuMzUgMzYuMzAgMTAwLjM1IDM3LjIxTDEwMC4xOSAzNy4wNkwxMDAuMzcgMzcuMjNRMTAwLjQ1IDM5LjAyIDEwMS42MyAzOS45NEwxMDEuNTcgMzkuODhMMTAxLjUzIDM5Ljg0UTEwMS41NyAzOS44NCAxMDEuODMgNDAuMDNMMTAxLjk5IDQwLjE5TDEwMS45NCA0MC4xM1ExMDIuOTIgNDIuMzcgMTEwLjA0IDQyLjYwWk0xMDkuODEgMzEuNjRMMTA5Ljc2IDMxLjU4TDEwOS42MyAzMS40NVExMTAuNzMgMzEuNTYgMTExLjYwIDMyLjAyTDExMS41NSAzMS45NkwxMTEuNTggMzIuMDBRMTExLjgyIDMyLjg0IDExMS43OCAzMy4zN0wxMTEuNzYgMzMuMzZMMTExLjg3IDMzLjQ3UTExMS44MCAzMy42NiAxMTEuODAgMzMuOTdMMTExLjkwIDM0LjA3TDExMS45NSAzNC4xMVExMTEuODUgMzYuMzcgMTA5LjU2IDM3LjIxTDEwOS42MyAzNy4yN0wxMDkuNTcgMzcuMjJRMTA4Ljc1IDM3LjUwIDEwNy45NSAzNy4zOEwxMDguMDAgMzcuNDRMMTA3LjkxIDM3LjM1UTEwNi44MSAzNy40NyAxMDUuNjcgMzcuMDFMMTA1LjcyIDM3LjA2TDEwNS43MiAzNy4wNlExMDUuNTkgMzYuNTUgMTA1LjY3IDM1LjU2TDEwNS41OCAzNS40OEwxMDUuNjcgMzUuNTdRMTA1Ljc1IDMzLjg5IDEwNi45NSAzMi42OEwxMDYuOTcgMzIuNjlMMTA3LjAwIDMyLjcyUTEwOC4xNiAzMS40NyAxMDkuNzYgMzEuNThaTTEwOS45NyAyMi4wOEwxMDkuOTggMjIuMTBMMTA5Ljg5IDIyLjAwUTExMC43MCAyMS45MCAxMTEuMjMgMjIuMDVMMTExLjI1IDIyLjA3TDExMS4zOCAyMy4wMEwxMTEuMjUgMjIuODdRMTExLjMyIDI0LjM1IDExMC40MSAyNS4zNkwxMTAuNDMgMjUuMzhMMTEwLjQzIDI1LjM4UTEwOS40NyAyNi4zNCAxMDguMDkgMjYuMTVMMTA4LjE3IDI2LjIyTDEwOC4wOCAyNi4xNFExMDcuMDIgMjYuMDYgMTA2LjYwIDI1LjgzTDEwNi43NCAyNS45OEwxMDYuNzIgMjUuOTVRMTA2LjcwIDI1LjcxIDEwNi41OSAyNS4wMkwxMDYuNjEgMjUuMDVMMTA2LjU4IDI1LjAyUTEwNi4yNCAyMy41MyAxMDcuNDUgMjIuNjlMMTA3LjU0IDIyLjc4TDEwNy41MiAyMi43NlExMDguNTggMjIuMDYgMTA5Ljk4IDIyLjEwWiIvPjwvc3ZnPg=='
) //人机校验图像
const answer = ref<string>('') //人机校验答案
const showCapture = ref<boolean>(false)
const closeCapture = () => {
  showCapture.value = false
  svg.value = ''
  key.value = ''
  answer.value = ''
}
const getCapture = async () => {
  const res = await generateCaptcha()
  if (res && res.key && res.svg) {
    key.value = res.key
    svg.value = res.svg
    showCapture.value = true
  }
}
const refreshCapture = () => {
  answer.value = ''
  getCapture()
}
const submitCapture = async () => {
  if (!answer.value) {
    return uni.showToast({
      title: '请先输入答案',
      icon: 'none',
      duration: 2000
    })
  }

  const res = await verifyCaptcha(key.value, answer.value)

  if (res && res.valid) {
    const res2 = await sendEmailCode(registerForm.email)
    console.log('--res', res2)
    if (res2 && res2.code) {
      closeCapture()
      uni.showToast({
        title: '验证码已经发送',
        icon: 'none',
        duration: 2000
      })
      codeTag.value = true
      return
    } else {
      refreshCapture()
      uni.showToast({
        title: '网络异常请重试',
        icon: 'none',
        duration: 2000
      })
    }
  } else {
    refreshCapture()
    uni.showToast({
      title: '答案错误',
      icon: 'none',
      duration: 2000
    })
  }
}
const getCode = async () => {
  const regx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!registerForm.email) {
    return uni.showToast({
      title: '请先输入邮箱',
      icon: 'none',
      duration: 2000
    })
  }
  if (regx.test(registerForm.email) === false) {
    return uni.showToast({
      title: '邮箱格式不正确',
      icon: 'none',
      duration: 2000
    })
  }

  getCapture()
}

const register = () => {
  if (!registerForm.username) {
    return uni.showToast({
      title: '请先输入昵称',
      icon: 'none',
      duration: 2000
    })
  }
  if (!registerForm.email) {
    return uni.showToast({
      title: '请先输入邮箱',
      icon: 'none',
      duration: 2000
    })
  }
  if (!registerForm.password) {
    return uni.showToast({
      title: '请先输入密码',
      icon: 'none',
      duration: 2000
    })
  }
  if (!registerForm.code) {
    return uni.showToast({
      title: '请先输入验证码',
      icon: 'none',
      duration: 2000
    })
  }
  if (!codeTag.value) {
    return uni.showToast({
      title: '请先获取验证码',
      icon: 'none',
      duration: 2000
    })
  }

  if (registerForm.code.length !== 5) {
    return uni.showToast({
      title: '验证码格式不正确',
      icon: 'none',
      duration: 2000
    })
  }
  registerAndsaveUserInfo(registerForm)
}

onShareAppMessage(() => {
  return {
    title: '注册',
    path: 'pages/register/register'
    // imageUrl: '/static/logo.png'
  }
})
</script>
<template>
  <view class="login-con" @touchmove.stop.prevent="() => {}">
    <view class="header-img">
      <image
        class="img"
        src="https://trial-cdn.esign.cn/upload/304e1190-5d8a-57a2-8537-cd4871ef77ad!!4-24.png"
        mode="scaleToFill"
      />
    </view>
    <view class="login-form">
      <view class="main">
        <view class="welcome">
          <image src="https://iili.io/3S9B0FV.png" mode="scaleToFill" />
        </view>

        <uni-forms ref="formRef" :modelValue="registerForm" :rules="rules">
          <view class="form-item">
            <view class="label">昵称</view>
            <uni-forms-item name="username">
              <uni-easyinput v-model="registerForm.username" placeholder="请输入昵称" :clearable="false">
              </uni-easyinput>
            </uni-forms-item>
          </view>

          <view class="form-item">
            <view class="label">邮箱</view>
            <uni-forms-item name="email">
              <uni-easyinput v-model="registerForm.email" placeholder="请输入邮箱" :clearable="false"> </uni-easyinput>
            </uni-forms-item>
          </view>

          <view class="form-item">
            <view class="label">密码</view>

            <uni-forms-item name="password">
              <uni-easyinput v-model="registerForm.password" placeholder="请输入密码" :clearable="false">
              </uni-easyinput>
            </uni-forms-item>
          </view>

          <view class="form-item code">
            <uni-forms-item name="code">
              <uni-easyinput v-model="registerForm.code" placeholder="请输入验证码" :clearable="false"> </uni-easyinput>
            </uni-forms-item>

            <view class="label" @click="getCode">获取验证码</view>
          </view>

          <view class="opt">
            <button register @click="register">注册</button>
          </view>
        </uni-forms>
      </view>
    </view>

    <view v-if="showCapture" class="captcha">
      <view class="main">
        <image class="img" :src="svg" mode="widthFix" />
        <view class="answer-con">
          <view class="answer-input">
            <uni-easyinput v-model="answer" placeholder="请输入答案" :clearable="false" />
          </view>
          <view class="label" @click="refreshCapture">换一张</view>
        </view>

        <button @click="submitCapture" class="submit-answer">提交</button>

        <image
          class="close"
          @click="closeCapture"
          src="https://daily-snap.oss-cn-hangzhou.aliyuncs.com/%E5%85%B3%E9%97%AD%402x.png"
          mode="aspectFit"
        />
      </view>
    </view>
  </view>
</template>
<style scoped lang="scss">
.login-con {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #fffa9e 13%, #e5f0ff 100%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding-top: 114rpx;
  padding-left: 40rpx;
  position: relative;

  .header-img {
    position: relative;
    z-index: 9;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .img {
      width: 670rpx;
      height: 484rpx;
    }
  }
  .login-form {
    width: 100%;
    position: relative;
    margin-top: 24rpx;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 51%;
      transform: translate(-50%, -50%);
      rotate: 2deg;
      transform-origin: center;
      width: 756rpx;
      height: 931rpx;
      background: #f4ed62;
      border-radius: 56rpx 0rpx 0rpx 56rpx;
    }
    .main {
      width: 100%;
      height: 920rpx;
      border-radius: 56rpx 0rpx 0rpx 56rpx;
      background: #fff;
      position: relative;
      z-index: 9;
      box-sizing: border-box;
      padding-top: 63rpx;
      padding-left: 48rpx;
      padding-right: 48rpx;
      z-index: 9;
    }
    .welcome {
      width: 609rpx;
      image {
        height: 65rpx;
      }
    }
    .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 40rpx;
      .label {
        width: 135rpx;
        height: 96rpx;
        background: #f6f6f6;
        border-radius: 60rpx 20rpx 20rpx 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: bold;
        font-size: 32rpx;
        color: #333333;
        line-height: 56rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        box-sizing: border-box;
        padding-left: 8rpx;
      }

      :deep(.uni-forms-item) {
        margin-bottom: 0;
      }
      :deep(.uni-easyinput),
      :deep(.uni-easyinput__content) {
        width: 455rpx;
        height: 96rpx;
        padding: 0 !important;
        border-radius: 20rpx 60rpx 60rpx 20rpx;
        .uni-easyinput__placeholder-class {
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 400;
          font-size: 28rpx;
          color: #999999;
          line-height: 56rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
        input {
          width: 455rpx;
          height: 92rpx;
          border-radius: 20rpx 60rpx 60rpx 20rpx;
          background: #f6f6f6;

          padding-left: 32rpx !important;
          &::placeholder {
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 400;
            font-size: 28rpx;
            color: #999999;
            line-height: 56rpx;
            text-align: left;
            font-style: normal;
            text-transform: none;
            padding-left: 32rpx;
          }
        }
      }
    }
    :deep(.is-input-border) {
      border: none;
    }
    .form-item.code {
      :deep(.uni-easyinput),
      :deep(.uni-easyinput__content) {
        width: 388rpx;
        height: 96rpx;
        background: #f6f6f6;
        border-radius: 60rpx 60rpx 60rpx 60rpx;
        input {
          width: 388rpx;
          height: 96rpx;
          background: #f6f6f6;
          border-radius: 60rpx 60rpx 60rpx 60rpx;

          padding-left: 40rpx;
          &::placeholder {
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 400;
            font-size: 28rpx;
            color: #999999;
            line-height: 56rpx;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
        }
      }
      .label {
        width: 202rpx;
        height: 96rpx;
        background: #f6f6f6;
        border-radius: 60rpx;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: 400;
        font-size: 28rpx;
        color: #da9000;
        line-height: 56rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
    .opt {
      width: 100%;
      margin-top: 40rpx;
      button::after {
        border: none;
      }
      button {
        width: 100%;
        height: 120rpx;
        background: #f9f26d;
        border-radius: 60rpx 60rpx 60rpx 60rpx;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: 800;
        font-size: 32rpx;
        color: #333333;
        font-style: normal;
        text-transform: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .captcha {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
    .main {
      width: 640rpx;

      background: #fff;
      box-sizing: border-box;
      padding: 40rpx;
      border-radius: 20rpx;
      .img {
        width: 100%;
        height: 239rpx;
        border-radius: 20rpx;
      }
      .close {
        width: 64rpx;
        height: 64rpx;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 460rpx;
        cursor: pointer;
      }

      button {
        width: 100%;
        height: 96rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        background: #f9f26d;
        border-radius: 60rpx;
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 600;
        font-size: 32rpx;
        color: #333333;

        font-style: normal;
        text-transform: none;
        &::after {
          border: none;
        }
      }

      .answer-con {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 40rpx 0;
        .label {
          width: 164rpx;
          height: 96rpx;
          flex-shrink: 0;

          background: #f6f6f6;
          border-radius: 20rpx 60rpx 60rpx 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 400;
          font-size: 28rpx;
          color: #da9000;
          line-height: 56rpx;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }
        .answer-input {
          margin-right: 24rpx;
          flex-shrink: 1;
        }
        :deep(.uni-easyinput),
        :deep(.uni-easyinput__content) {
          width: 372rpx;
          height: 96rpx;
          padding: 0 !important;
          border-radius: 60rpx 20rpx 20rpx 60rpx;
          .uni-easyinput__placeholder-class {
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 400;
            font-size: 28rpx;
            color: #999999;
            line-height: 56rpx;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
          input {
            width: 372rpx;
            height: 92rpx;
            border-radius: 60rpx 20rpx 20rpx 60rpx;
            background: #f6f6f6;

            padding-left: 32rpx !important;
            &::placeholder {
              font-family:
                PingFang SC,
                PingFang SC;
              font-weight: 400;
              font-size: 28rpx;
              color: #999999;
              line-height: 56rpx;
              text-align: left;
              font-style: normal;
              text-transform: none;
              padding-left: 32rpx;
            }
          }
        }
      }
    }
  }
}
</style>
